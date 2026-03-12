/**
 * @fileoverview Task Service
 *
 * Business logic for task CRUD operations in the Workforce microservice.
 *
 * Interacts with the User microservice to validate user existence and retrieve user details for task creation and updates. Uses Mongoose models to manage task data in MongoDB, including validation of related client and project references. Handles task creation, retrieval (single and paginated), updates (full and status-only), and deletion with appropriate error handling for not found resources and invalid operations (e.g., deleting tasks that are in progress).
 */
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { USER_COMMANDS } from "@shared/constants/user-command.constants";
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import { AuthUser } from "@shared/interfaces";
import { getSignedUrl } from "@shared/utils/minio.client";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import {
  Client,
  ClientDocument,
  Project,
  ProjectDocument,
} from "../schemas/project.schema";
import {
  DcrSubmissionStatus,
  Task,
  TaskDocument,
  TaskStatus,
} from "../schemas/task.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import {
  ReplyOnDcrReviewDto,
  UpdateDcrSubmissionStatusDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from "./dto/update-task.dto";

@Injectable()
export class TaskService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  /**
   * Create a new task.
   *
   * @param {AuthUser} user - The authenticated user creating the task.
   * @param {CreateTaskDto} createTaskDto - The details of the task to create.
   * @returns {Promise<any>} The created task or an error message if validation fails.
   */
  async create(user: AuthUser, createTaskDto: CreateTaskDto) {
    const userId = (user.id ?? user._id) as string;

    const userDoc = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USER, { id: userId }),
    );

    if (userDoc.exception) {
      return {
        message: userDoc.message,
        exception: userDoc.exception,
      };
    }

    let assignees;

    if (createTaskDto.assignTo?.length) {
      assignees = await firstValueFrom(
        this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
          ids: createTaskDto.assignTo,
        }),
      );

      if (assignees.length !== createTaskDto.assignTo?.length) {
        return {
          message: "Some assignees not found",
          exception: "NotFoundException",
        };
      }
    }

    const project = await this.projectModel
      .findById(createTaskDto.project)
      .lean();

    if (!project) {
      return {
        message: "Project not found",
        exception: "NotFoundException",
      };
    }

    const result = await this.taskModel.create({
      ...createTaskDto,
      project: new Types.ObjectId(createTaskDto.project),
      createdBy: new Types.ObjectId(userId),
    });

    return {
      _id: result._id,
      name: result.name,
      project: {
        _id: project._id,
        name: project.name,
      },
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,
      createdBy: { _id: userDoc._id, name: userDoc.name },
      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: result.dcrSubmissionStatus,
      dcrApprovedBy: result.dcrApprovedBy,
      dcrRejectedBy: result.dcrRejectedBy,
      reviewReply: result.reviewReply,
      assignTo: assignees?.map((a) => {
        return { _id: a._id, name: a.name };
      }),
    };
  }

  /**
   * Create a new task.
   *
   * @param {AuthUser} user - The authenticated user creating the task.
   * @param {CreateTaskDto} createTaskDto - The details of the task to create.
   * @returns {Promise<any>} The created task or an error message if validation fails.
   */
  async findAll(
    user: AuthUser,
    query: SearchQueryDto & { status: TaskStatus },
  ) {
    const filter: any = {};

    // Employee can only see own created or assigned tasks
    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(user._id) },
        { assignTo: { $in: [new Types.ObjectId(user._id)] } },
      ];
    }

    let { pageNo = 1, pageSize = 10, searchKey, status } = query;

    pageNo = Number(pageNo);
    pageSize = Number(pageSize);

    if (searchKey) {
      filter.$or = [
        { name: { $regex: searchKey, $options: "i" } },
        { description: { $regex: searchKey, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const skip = (pageNo - 1) * pageSize;

    const [tasks, total] = await Promise.all([
      this.taskModel.aggregate([
        { $match: filter },

        {
          $lookup: {
            from: "projects",
            localField: "project",
            foreignField: "_id",
            as: "project",
          },
        },

        { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },

        {
          $addFields: {
            statusOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", TaskStatus.PENDING] }, then: 1 },
                  { case: { $eq: ["$status", TaskStatus.WIP] }, then: 2 },
                  { case: { $eq: ["$status", TaskStatus.COMPLETED] }, then: 3 },
                  { case: { $eq: ["$status", TaskStatus.BLOCKED] }, then: 4 },
                  { case: { $eq: ["$status", TaskStatus.DELIVERED] }, then: 5 },
                ],
                default: 6,
              },
            },
          },
        },

        { $sort: { statusOrder: 1, createdAt: -1 } },

        { $skip: skip },

        { $limit: pageSize },

        {
          $project: {
            _id: 1,
            name: 1,
            "project._id": 1,
            "project.name": 1,
            dueDate: 1,
            priority: 1,
            description: 1,
            status: 1,
            createdBy: 1,
            assignTo: 1,
            dcrLinks: 1,
            dcrSubmissionStatus: 1,
            dcrApprovedBy: 1,
            dcrRejectedBy: 1,
            reviewReply: 1,
            createdAt: 1,
          },
        },
      ]),

      this.taskModel.countDocuments(filter),
    ]);

    /**
     * Collect all user IDs
     */
    const userIds = new Set<string>();

    tasks.forEach((task: any) => {
      if (task.createdBy) {
        userIds.add(task.createdBy.toString());
      }

      task.assignTo?.forEach((id: any) => {
        userIds.add(id.toString());
      });

      if (task.dcrApprovedBy) {
        userIds.add(task.dcrApprovedBy.toString());
      }

      if (task.dcrRejectedBy) {
        userIds.add(task.dcrRejectedBy.toString());
      }

      task.reviewReply?.forEach((reply: any) => {
        userIds.add(reply.reviewer.toString());
      });
    });

    /**
     * Fetch users from user-service
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Format tasks
     */
    const formattedTasks = await Promise.all(
      tasks.map(async (task: any) => ({
        _id: task._id,
        name: task.name,
        project: task.project
          ? { _id: task.project._id, name: task.project.name }
          : null,
        dueDate: task.dueDate,
        priority: task.priority,
        description: task.description,
        status: task.status,

        createdBy: userMap.get(task.createdBy?.toString())
          ? {
              _id: task.createdBy,
              name: userMap.get(task.createdBy?.toString())?.name,
            }
          : null,

        assignTo:
          task.assignTo?.map((id: any) => {
            const user = userMap.get(id.toString());
            return user ? { _id: user._id, name: user.name } : null;
          }) || [],

        dcrLinks: task.dcrLinks
          ? await Promise.all(
              task.dcrLinks.map(async (link: string) => {
                return await getSignedUrl(link);
              }),
            )
          : [],

        dcrSubmissionStatus: task.dcrSubmissionStatus,

        dcrApprovedBy: task.dcrApprovedBy
          ? {
              _id: task.dcrApprovedBy,
              name: userMap.get(task.dcrApprovedBy.toString())?.name || null,
            }
          : null,

        dcrRejectedBy: task.dcrRejectedBy
          ? {
              _id: task.dcrRejectedBy,
              name: userMap.get(task.dcrRejectedBy.toString())?.name || null,
            }
          : null,

        reviewReply: task.reviewReply?.map((reply: any) => ({
          reviewer: {
            _id: reply.reviewer,
            name: userMap.get(reply.reviewer.toString())?.name || null,
          },
          comment: reply.comment,
          createdAt: reply.createdAt,
        })),
      })),
    );

    return {
      tasks: formattedTasks,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Find a task by ID.
   *
   * @param {MongoIdDto["id"]} id - The ID of the task to find.
   * @returns {Promise<any>} The found task or an error message if not found.
   */
  async findOne(user: AuthUser, id: MongoIdDto["id"]) {
    const filter: any = {};

    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(user._id) },
        { assignTo: { $in: [new Types.ObjectId(user._id)] } },
      ];
    }

    const task = (await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        ...filter,
      })
      .populate("project")
      .lean()) as any;

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    /**
     * Collect user IDs (remove duplicates)
     */
    const userIds = new Set<string>();

    if (task.createdBy) userIds.add(task.createdBy.toString());

    task.assignTo?.forEach((id: any) => {
      userIds.add(id.toString());
    });

    if (task.dcrApprovedBy) {
      userIds.add(task.dcrApprovedBy.toString());
    }

    if (task.dcrRejectedBy) {
      userIds.add(task.dcrRejectedBy.toString());
    }

    task.reviewReply?.forEach((r: any) => {
      userIds.add(r.reviewer.toString());
    });

    /**
     * Fetch users
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Format response
     */
    return {
      _id: task._id,
      name: task.name,
      project: {
        _id: task.project?._id,
        name: task.project?.name,
      },
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,

      createdBy: userMap.get(task.createdBy?.toString())
        ? {
            _id: task.createdBy,
            name: userMap.get(task.createdBy?.toString())?.name,
          }
        : null,

      assignTo:
        task.assignTo?.map((id: any) => {
          const user = userMap.get(id.toString());
          return user ? { _id: user._id, name: user.name } : null;
        }) || [],

      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link: string) => {
              return await getSignedUrl(link);
            }),
          )
        : [],

      dcrSubmissionStatus: task.dcrSubmissionStatus,

      dcrApprovedBy: task.dcrApprovedBy
        ? {
            _id: task.dcrApprovedBy,
            name: userMap.get(task.dcrApprovedBy.toString())?.name || null,
          }
        : null,

      dcrRejectedBy: task.dcrRejectedBy
        ? {
            _id: task.dcrRejectedBy,
            name: userMap.get(task.dcrRejectedBy.toString())?.name || null,
          }
        : null,

      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: {
          _id: reply.reviewer,
          name: userMap.get(reply.reviewer.toString())?.name || null,
        },
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }

  /**
   * Update a task by ID.
   *
   * @param {MongoIdDto["id"]} id - The ID of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The details to update the task with.
   * @returns {Promise<any>} The updated task or an error message if not found.
   */
  async update(
    user: AuthUser,
    id: MongoIdDto["id"],
    updateTaskDto: UpdateTaskDto,
  ) {
    const filter: any = {};

    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(user._id) },
        { assignTo: { $in: [new Types.ObjectId(user._id)] } },
      ];
    }

    const existingTask = (await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        ...filter,
      })
      .populate("project")
      .lean()) as any;

    if (!existingTask) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    if (user.role === "EMPLOYEE") {
      if (
        existingTask.status === TaskStatus.WIP ||
        existingTask.status === TaskStatus.BLOCKED ||
        existingTask.status === TaskStatus.DELIVERED ||
        existingTask.status === TaskStatus.COMPLETED
      ) {
        return {
          message:
            "Cannot update task that is in progress, blocked, delivered or completed",
          exception: "BadRequestException",
        };
      }
    }

    const task = (await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          ...existingTask,
          name: updateTaskDto.name ? updateTaskDto.name : existingTask.name,
          project: updateTaskDto.project
            ? new Types.ObjectId(updateTaskDto.project)
            : existingTask.project,
          dueDate: updateTaskDto.dueDate
            ? updateTaskDto.dueDate
            : existingTask.dueDate,
          priority: updateTaskDto.priority
            ? updateTaskDto.priority
            : existingTask.priority,
          description: updateTaskDto.description
            ? updateTaskDto.description
            : existingTask.description,
          status: updateTaskDto.status
            ? updateTaskDto.status
            : existingTask.status,
          assignTo: updateTaskDto.assignTo
            ? updateTaskDto.assignTo.map((id) => new Types.ObjectId(id))
            : existingTask.assignTo,
        },
        { new: true },
      )
      .populate("project")
      .lean()) as any;

    /**
     * Collect user IDs
     */
    const userIds = new Set<string>();

    if (task.createdBy) userIds.add(task.createdBy.toString());

    task.assignTo?.forEach((id: any) => {
      userIds.add(id.toString());
    });

    if (task.dcrApprovedBy) {
      userIds.add(task.dcrApprovedBy.toString());
    }

    if (task.dcrRejectedBy) {
      userIds.add(task.dcrRejectedBy.toString());
    }

    task.reviewReply?.forEach((r: any) => {
      userIds.add(r.reviewer.toString());
    });

    /**
     * Fetch users
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Format response
     */
    return {
      _id: task._id,
      name: task.name,
      project: {
        _id: task.project?._id,
        name: task.project?.name,
      },
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,

      createdBy: userMap.get(task.createdBy?.toString())
        ? {
            _id: task.createdBy,
            name: userMap.get(task.createdBy?.toString())?.name,
          }
        : null,

      assignTo:
        task.assignTo?.map((id: any) => {
          const user = userMap.get(id.toString());
          return user ? { _id: user._id, name: user.name } : null;
        }) || [],

      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link: string) => {
              return await getSignedUrl(link);
            }),
          )
        : [],

      dcrSubmissionStatus: task.dcrSubmissionStatus,

      dcrApprovedBy: task.dcrApprovedBy
        ? {
            _id: task.dcrApprovedBy,
            name: userMap.get(task.dcrApprovedBy.toString())?.name || null,
          }
        : null,

      dcrRejectedBy: task.dcrRejectedBy
        ? {
            _id: task.dcrRejectedBy,
            name: userMap.get(task.dcrRejectedBy.toString())?.name || null,
          }
        : null,

      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())
          ? {
              _id: reply.reviewer,
              name: userMap.get(reply.reviewer.toString())?.name,
            }
          : null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }

  /**
   * Update the status of a task by ID.
   *
   * @param {MongoIdDto["id"]} id - The ID of the task to update.
   * @param {UpdateTaskStatusDto} updateTaskStatusDto - The new status for the task.
   * @returns {Promise<any>} The updated task or an error message if not found.
   */
  async updateTaskStatus(
    user: AuthUser,
    id: MongoIdDto["id"],
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const filter: any = {};

    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(user._id) },
        { assignTo: { $in: [new Types.ObjectId(user._id)] } },
      ];
    }

    const existingTask = await this.taskModel.findOne({
      _id: new Types.ObjectId(id),
      ...filter,
    });

    if (!existingTask) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    /**
     * Update task
     */
    const task = (await this.taskModel
      .findByIdAndUpdate(id, updateTaskStatusDto, { new: true })
      .populate("project")
      .lean()) as any;

    /**
     * Collect user ids
     */
    const userIds = new Set<string>();

    if (task.createdBy) userIds.add(task.createdBy.toString());

    task.assignTo?.forEach((id: any) => {
      userIds.add(id.toString());
    });

    if (task.dcrApprovedBy) {
      userIds.add(task.dcrApprovedBy.toString());
    }

    if (task.dcrRejectedBy) {
      userIds.add(task.dcrRejectedBy.toString());
    }

    task.reviewReply?.forEach((r: any) => {
      userIds.add(r.reviewer.toString());
    });

    /**
     * Fetch users
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Format response
     */
    return {
      _id: task._id,
      name: task.name,
      project: {
        _id: task.project?._id,
        name: task.project?.name,
      },
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,

      createdBy: userMap.get(task.createdBy?.toString())
        ? {
            _id: task.createdBy,
            name: userMap.get(task.createdBy?.toString())?.name,
          }
        : null,

      assignTo:
        task.assignTo?.map((id: any) => {
          const user = userMap.get(id.toString());
          return user ? { _id: user._id, name: user.name } : null;
        }) || [],

      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link: string) => {
              return await getSignedUrl(link);
            }),
          )
        : [],

      dcrSubmissionStatus: task.dcrSubmissionStatus,

      dcrApprovedBy: task.dcrApprovedBy
        ? {
            _id: task.dcrApprovedBy,
            name: userMap.get(task.dcrApprovedBy.toString())?.name || null,
          }
        : null,

      dcrRejectedBy: task.dcrRejectedBy
        ? {
            _id: task.dcrRejectedBy,
            name: userMap.get(task.dcrRejectedBy.toString())?.name || null,
          }
        : null,

      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())
          ? {
              _id: reply.reviewer,
              name: userMap.get(reply.reviewer.toString())?.name,
            }
          : null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }

  /**
   * Delete a task by ID.
   *
   * @param {MongoIdDto["id"]} id - The ID of the task to delete.
   * @returns {Promise<any>} A success message or an error message if not found or if deletion is not allowed.
   */
  async remove(user: AuthUser, id: MongoIdDto["id"]) {
    const filter: any = {};

    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(user._id) },
        { assignTo: { $in: [new Types.ObjectId(user._id)] } },
      ];
    }

    const task = await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        ...filter,
      })
      .lean();

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    // Prevent deletion if task is in progress, blocked, delivered or completed
    if (
      TaskStatus.WIP === task.status ||
      TaskStatus.BLOCKED === task.status ||
      TaskStatus.DELIVERED === task.status ||
      TaskStatus.COMPLETED === task.status
    ) {
      return {
        message:
          "Cannot delete task that is in progress, blocked, delivered or completed",
        exception: "BadRequestException",
      };
    }

    return await this.taskModel
      .deleteOne({ _id: new Types.ObjectId(id) })
      .lean();
  }

  /**
   * Submit a DCR for a task.
   *
   * @param {MongoIdDto["id"]} userId - The ID of the user submitting the DCR.
   * @param {MongoIdDto["id"]} taskId - The ID of the task for which the DCR is being submitted.
   * @param {string[]} dcrLinks - The links to the DCR files being submitted.
   * @returns {Promise<any>} The updated task with the submitted DCR details or an error message if the task is not found or if the user is not authorized to submit the DCR.
   */
  async submitDcr(
    userId: MongoIdDto["id"],
    taskId: MongoIdDto["id"],
    dcrLinks: string[],
  ) {
    const task = await this.taskModel
      .findOne({
        _id: new Types.ObjectId(taskId),
        $or: [
          { createdBy: new Types.ObjectId(userId) },
          {
            assignTo: {
              $in: [new Types.ObjectId(userId)],
            },
          },
        ],
      })
      .lean();

    if (!task) {
      return {
        message: "Task not found or you are not authorized to submit DCR",
        exception: "NotFoundException",
      };
    }

    /**
     * Update DCR
     */
    const result = (await this.taskModel
      .findByIdAndUpdate(
        taskId,
        {
          dcrLinks,
          dcrSubmissionStatus: DcrSubmissionStatus.SUBMITTED,
        },
        { new: true },
      )
      .populate("project")
      .lean()) as any;

    if (!result) {
      return {
        message: "Failed to submit DCR",
        exception: "InternalServerErrorException",
      };
    }

    /**
     * Collect user IDs
     */
    const userIds = new Set<string>();

    if (result.createdBy) userIds.add(result.createdBy.toString());

    result.assignTo?.forEach((id: any) => {
      userIds.add(id.toString());
    });

    if (result.dcrApprovedBy) {
      userIds.add(result.dcrApprovedBy.toString());
    }

    if (result.dcrRejectedBy) {
      userIds.add(result.dcrRejectedBy.toString());
    }

    result.reviewReply?.forEach((r: any) => {
      userIds.add(r.reviewer.toString());
    });

    /**
     * Fetch users
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Format response
     */
    return {
      _id: result._id,
      name: result.name,
      project: {
        _id: result.project?._id,
        name: result.project?.name,
      },
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,

      createdBy: userMap.get(result.createdBy?.toString())
        ? {
            _id: result.createdBy,
            name: userMap.get(result.createdBy?.toString())?.name,
          }
        : null,

      assignTo:
        result.assignTo?.map((id: any) => {
          const user = userMap.get(id.toString());
          return user ? { _id: user._id, name: user.name } : null;
        }) || [],

      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link: string) => {
              return await getSignedUrl(link);
            }),
          )
        : [],

      dcrSubmissionStatus: result.dcrSubmissionStatus,

      dcrApprovedBy: result.dcrApprovedBy
        ? {
            _id: result.dcrApprovedBy,
            name: userMap.get(result.dcrApprovedBy.toString())?.name || null,
          }
        : null,

      dcrRejectedBy: result.dcrRejectedBy
        ? {
            _id: result.dcrRejectedBy,
            name: userMap.get(result.dcrRejectedBy.toString())?.name || null,
          }
        : null,

      reviewReply: result.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())
          ? {
              _id: reply.reviewer,
              name: userMap.get(reply.reviewer.toString())?.name,
            }
          : null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }

  /**
   * Update the DCR submission status of a task.
   *
   * @param {AuthUser} user - The authenticated user updating the status.
   * @param {MongoIdDto["id"]} taskId - The ID of the task to update.
   * @param {UpdateDcrSubmissionStatusDto} updateDto - The status update details.
   * @returns {Promise<any>} The updated task or an error message.
   */
  async updateDcrSubmissionStatus(
    user: AuthUser,
    taskId: MongoIdDto["id"],
    updateDto: UpdateDcrSubmissionStatusDto,
  ) {
    const { status } = updateDto;
    const userId = (user.id ?? user._id) as string;

    const task = await this.taskModel.findById(taskId).lean();

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    /**
     * Prepare update payload
     */
    const updateData: any = { dcrSubmissionStatus: status };

    if (status === DcrSubmissionStatus.APPROVED) {
      updateData.dcrApprovedBy = new Types.ObjectId(userId);
      updateData.dcrRejectedBy = null;
    }

    if (status === DcrSubmissionStatus.REJECTED) {
      updateData.dcrRejectedBy = new Types.ObjectId(userId);
      updateData.dcrApprovedBy = null;
    }

    /**
     * Update task
     */
    const result = (await this.taskModel
      .findByIdAndUpdate(taskId, updateData, { new: true })
      .populate("project")
      .lean()) as any;

    if (!result) {
      return {
        message: "Failed to update DCR submission status",
        exception: "InternalServerErrorException",
      };
    }

    /**
     * Collect user ids (unique)
     */
    const userIds = new Set<string>();

    if (result.createdBy) userIds.add(result.createdBy.toString());

    result.assignTo?.forEach((id: any) => {
      userIds.add(id.toString());
    });

    if (result.dcrApprovedBy) {
      userIds.add(result.dcrApprovedBy.toString());
    }

    if (result.dcrRejectedBy) {
      userIds.add(result.dcrRejectedBy.toString());
    }

    result.reviewReply?.forEach((r: any) => {
      userIds.add(r.reviewer.toString());
    });

    /**
     * Fetch users
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Response formatter
     */
    return {
      _id: result._id,
      name: result.name,
      project: {
        _id: result.project?._id,
        name: result.project?.name,
      },
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,

      createdBy: userMap.get(result.createdBy?.toString())
        ? {
            _id: result.createdBy,
            name: userMap.get(result.createdBy?.toString())?.name,
          }
        : null,

      assignTo:
        result.assignTo?.map((id: any) => {
          const user = userMap.get(id.toString());
          return user ? { _id: user._id, name: user.name } : null;
        }) || [],

      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link: string) => {
              return await getSignedUrl(link);
            }),
          )
        : [],

      dcrSubmissionStatus: result.dcrSubmissionStatus,

      dcrApprovedBy: result.dcrApprovedBy
        ? {
            _id: result.dcrApprovedBy,
            name: userMap.get(result.dcrApprovedBy.toString())?.name || null,
          }
        : null,

      dcrRejectedBy: result.dcrRejectedBy
        ? {
            _id: result.dcrRejectedBy,
            name: userMap.get(result.dcrRejectedBy.toString())?.name || null,
          }
        : null,

      reviewReply: result.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())
          ? {
              _id: reply.reviewer,
              name: userMap.get(reply.reviewer.toString())?.name,
            }
          : null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }

  /**
   * Add a review comment to a DCR submission.
   *
   * @param {AuthUser} user - The authenticated user adding the review comment.
   * @param {MongoIdDto["id"]} id - The ID of the task for which the review comment is being added.
   * @param {string} comment - The review comment to add.
   * @return {Promise<any>} The updated task with the new review comment or an error message if the task is not found or if the user is not authorized to add the review comment.
   */
  async replyOnDcrReview(
    user: AuthUser,
    id: MongoIdDto["id"],
    comment: ReplyOnDcrReviewDto["comment"],
  ) {
    const userId = (user.id ?? user._id) as string;

    const filter: any = {};
    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(userId) },
        { assignTo: { $in: [new Types.ObjectId(userId)] } },
      ];
    }

    const task = await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        ...filter,
      })
      .lean();

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    /**
     * Add review reply (atomic update)
     */
    const result = (await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            reviewReply: {
              reviewer: new Types.ObjectId(userId),
              comment,
              createdAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .populate("project")
      .lean()) as any;

    if (!result) {
      return {
        message: "Failed to add review reply",
        exception: "InternalServerErrorException",
      };
    }

    /**
     * Collect user ids (unique)
     */
    const userIds = new Set<string>();

    if (result.createdBy) userIds.add(result.createdBy.toString());

    result.assignTo?.forEach((id: any) => {
      userIds.add(id.toString());
    });

    if (result.dcrApprovedBy) {
      userIds.add(result.dcrApprovedBy.toString());
    }

    if (result.dcrRejectedBy) {
      userIds.add(result.dcrRejectedBy.toString());
    }

    result.reviewReply?.forEach((r: any) => {
      userIds.add(r.reviewer.toString());
    });

    /**
     * Fetch users
     */
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    /**
     * Create user map
     */
    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    /**
     * Format response
     */
    return {
      _id: result._id,
      name: result.name,
      project: {
        _id: result.project?._id,
        name: result.project?.name,
      },
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,

      createdBy: userMap.get(result.createdBy?.toString())
        ? {
            _id: result.createdBy,
            name: userMap.get(result.createdBy?.toString())?.name,
          }
        : null,

      assignTo:
        result.assignTo?.map((id: any) => {
          const user = userMap.get(id.toString());
          return user ? { _id: user._id, name: user.name } : null;
        }) || [],

      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link: string) => {
              return await getSignedUrl(link);
            }),
          )
        : [],

      dcrSubmissionStatus: result.dcrSubmissionStatus,

      dcrApprovedBy: result.dcrApprovedBy
        ? {
            _id: result.dcrApprovedBy,
            name: userMap.get(result.dcrApprovedBy.toString())?.name || null,
          }
        : null,

      dcrRejectedBy: result.dcrRejectedBy
        ? {
            _id: result.dcrRejectedBy,
            name: userMap.get(result.dcrRejectedBy.toString())?.name || null,
          }
        : null,

      reviewReply: result.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())
          ? {
              _id: reply.reviewer,
              name: userMap.get(reply.reviewer.toString())?.name,
            }
          : null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }
}
