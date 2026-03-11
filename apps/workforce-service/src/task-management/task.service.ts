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

    if (createTaskDto.assignTo?.length) {
      const assignees = await firstValueFrom(
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
      createdBy: userId,
    });

    return {
      _id: result._id,
      name: result.name,
      project: project.name,
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,
      createdBy: userId,
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
      assignTo: createTaskDto.assignTo,
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

    // If the user is employee then he can only see the tasks assigned to him or created by him
    if (user.role === "EMPLOYEE") {
      filter.$or = [
        { createdBy: new Types.ObjectId(user.id) },
        { assignTo: { $in: [new Types.ObjectId(user.id)] } },
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
            project: 1,
            dueDate: 1,
            priority: 1,
            description: 1,
            status: 1,
            createdBy: 1,
            assignTo: 1,
            createdAt: 1,
          },
        },
      ]),
      this.taskModel.countDocuments(filter),
    ]);

    if (!tasks.length) {
      return {
        tasks: [],
        total: 0,
        totalPages: 0,
      };
    }

    // Collect all user ids
    const userIds = new Set<string>();

    tasks.forEach((task: any) => {
      userIds.add(task.createdBy.toString());
      task.assignTo.forEach((id: any) => userIds.add(id.toString()));
      task.dcrApprovedBy?.forEach((id: any) => userIds.add(id.toString()));
      task.dcrRejectedBy?.forEach((id: any) => userIds.add(id.toString()));
      task.reviewReply?.forEach((reply: any) =>
        userIds.add(reply.reviewer.toString()),
      );
    });

    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: Array.from(userIds),
      }),
    );

    const userMap = new Map();

    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    const formattedTasks = tasks.map(async (task: any) => ({
      _id: task._id,
      name: task.name,
      project: task.project,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,
      createdBy: userMap.get(task.createdBy.toString())?.name || null,
      assignTo: task.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name || null,
      ),
      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: task.dcrSubmissionStatus,
      dcrApprovedBy: task.dcrApprovedBy
        ? userMap.get(task.dcrApprovedBy.toString())?.name
        : null,
      dcrRejectedBy: task.dcrRejectedBy
        ? userMap.get(task.dcrRejectedBy.toString())?.name
        : null,
      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name || null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
      createdAt: task.createdAt,
    }));

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
    const task = (await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        $or: [
          { createdBy: user.id },
          {
            assignTo: {
              $in: [user.id],
            },
          },
        ],
      })
      .populate("project")
      .lean()) as any;

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    // Collect all user ids
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: [
          task.createdBy,
          ...task.assignTo,
          task.dcrApprovedBy,
          task.dcrRejectedBy,
          ...(task.reviewReply?.map((r: any) => r.reviewer) || []),
        ].filter(Boolean) as string[],
      }),
    );

    const userMap = new Map();

    // Create a map of userId to user details for easy lookup
    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    return {
      _id: task._id,
      name: task.name,
      project: task.project,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,
      createdBy: userMap.get(task.createdBy.toString())?.name,
      assignTo: task.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name,
      ),
      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: task.dcrSubmissionStatus,
      dcrApprovedBy: task.dcrApprovedBy
        ? userMap.get(task.dcrApprovedBy.toString())?.name
        : null,
      dcrRejectedBy: task.dcrRejectedBy
        ? userMap.get(task.dcrRejectedBy.toString())?.name
        : null,
      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name || null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
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
    const task = (await this.taskModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          $or: [
            { createdBy: user.id },
            {
              assignTo: {
                $in: [user.id],
              },
            },
          ],
        },
        updateTaskDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .populate("project")
      .lean()) as any;

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    // Collect all user ids
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: [
          task.createdBy,
          ...task.assignTo,
          task.dcrApprovedBy,
          task.dcrRejectedBy,
        ].filter(Boolean) as string[],
      }),
    );

    const userMap = new Map();

    // Create a map of userId to user details for easy lookup
    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    return {
      _id: task._id,
      name: task.name,
      project: task.project,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,
      createdBy: userMap.get(task.createdBy.toString())?.name,
      assignTo: task.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name,
      ),
      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: task.dcrSubmissionStatus,
      dcrApprovedBy: task.dcrApprovedBy
        ? userMap.get(task.dcrApprovedBy.toString())?.name
        : null,
      dcrRejectedBy: task.dcrRejectedBy
        ? userMap.get(task.dcrRejectedBy.toString())?.name
        : null,
      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name || null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
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
    const task = (await this.taskModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          $or: [
            { createdBy: user.id },
            {
              assignTo: {
                $in: [user.id],
              },
            },
          ],
        },
        updateTaskStatusDto,
        {
          new: true,
        },
      )
      .populate("project")
      .lean()) as any;

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    // Prevent update if task is in progress, blocked, delivered or completed
    if (
      TaskStatus.WIP === task.status ||
      TaskStatus.BLOCKED === task.status ||
      TaskStatus.DELIVERED === task.status ||
      TaskStatus.COMPLETED === task.status
    ) {
      return {
        message:
          "Cannot update task that is in progress, blocked, delivered or completed",
        exception: "BadRequestException",
      };
    }

    // Collect all user ids
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: [
          task.createdBy,
          ...task.assignTo,
          task.dcrApprovedBy,
          task.dcrRejectedBy,
          ...(task.reviewReply?.map((r: any) => r.reviewer) || []),
        ].filter(Boolean) as string[],
      }),
    );

    const userMap = new Map();

    // Create a map of userId to user details for easy lookup
    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    return {
      _id: task._id,
      name: task.name,
      project: task.project,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      status: task.status,
      createdBy: userMap.get(task.createdBy.toString())?.name,
      assignTo: task.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name,
      ),
      dcrLinks: task.dcrLinks
        ? await Promise.all(
            task.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: task.dcrSubmissionStatus,
      dcrApprovedBy: task.dcrApprovedBy
        ? userMap.get(task.dcrApprovedBy.toString())?.name
        : null,
      dcrRejectedBy: task.dcrRejectedBy
        ? userMap.get(task.dcrRejectedBy.toString())?.name
        : null,
      reviewReply: task.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name || null,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  /**
   * Delete a task by ID.
   *
   * @param {MongoIdDto["id"]} id - The ID of the task to delete.
   * @returns {Promise<any>} A success message or an error message if not found or if deletion is not allowed.
   */
  async remove(user: AuthUser, id: MongoIdDto["id"]) {
    const task = await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        $or: [
          { createdBy: user.id },
          {
            assignTo: {
              $in: [user.id],
            },
          },
        ],
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

    // Collect all user ids
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: [
          task.createdBy,
          ...task.assignTo,
          task.dcrApprovedBy,
          task.dcrRejectedBy,
          ...(task.reviewReply?.map((r: any) => r.reviewer) || []),
        ].filter(Boolean) as string[],
      }),
    );

    const userMap = new Map();

    // Create a map of userId to user details for easy lookup
    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    const result = await this.taskModel
      .findByIdAndUpdate(
        taskId,
        {
          dcrLinks,
          dcrSubmissionStatus: DcrSubmissionStatus.SUBMITTED,
        },
        { new: true },
      )
      .populate("project");

    if (!result) {
      return {
        message: "Failed to submit DCR",
        exception: "InternalServerErrorException",
      };
    }

    return {
      _id: result._id,
      name: result.name,
      project: result.project,
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,
      createdBy: userMap.get(result.createdBy.toString())?.name,
      assignTo: result.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name,
      ),
      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: result.dcrSubmissionStatus,
      dcrApprovedBy: userMap.get(result.dcrApprovedBy?.toString())?.name,
      dcrRejectedBy: userMap.get(result.dcrRejectedBy?.toString())?.name,
      reviewReply: result.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name,
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

    // Collect all user ids
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: [
          task.createdBy,
          ...task.assignTo,
          task.dcrApprovedBy,
          task.dcrRejectedBy,
          ...(task.reviewReply?.map((r: any) => r.reviewer) || []),
        ].filter(Boolean) as string[],
      }),
    );

    const userMap = new Map();

    // Create a map of userId to user details for easy lookup
    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    const updateData: any = { dcrSubmissionStatus: status };

    if (status === DcrSubmissionStatus.APPROVED) {
      updateData.dcrApprovedBy = new Types.ObjectId(userId);
      updateData.dcrRejectedBy = null;
    } else if (status === DcrSubmissionStatus.REJECTED) {
      updateData.dcrRejectedBy = new Types.ObjectId(userId);
      updateData.dcrApprovedBy = null;
    }

    const result = await this.taskModel
      .findByIdAndUpdate(taskId, updateData, { new: true })
      .populate("project")
      .lean();

    if (!result) {
      return {
        message: "Failed to update DCR submission status",
        exception: "InternalServerErrorException",
      };
    }

    return {
      _id: result._id,
      name: result.name,
      project: result.project,
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,
      createdBy: userMap.get(result.createdBy.toString())?.name,
      assignTo: result.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name,
      ),
      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: result.dcrSubmissionStatus,
      dcrApprovedBy: userMap.get(result.dcrApprovedBy?.toString())?.name,
      dcrRejectedBy: userMap.get(result.dcrRejectedBy?.toString())?.name,
      reviewReply: result.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name,
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

    const task = await this.taskModel.findById(id).lean();

    if (!task) {
      return {
        message: "Task not found",
        exception: "NotFoundException",
      };
    }

    // Collect all user ids
    const users = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.GET_USERS_BY_IDS, {
        ids: [
          task.createdBy,
          ...task.assignTo,
          task.dcrApprovedBy,
          task.dcrRejectedBy,
          ...(task.reviewReply?.map((r: any) => r.reviewer) || []),
        ].filter(Boolean) as string[],
      }),
    );

    const userMap = new Map();

    // Create a map of userId to user details for easy lookup
    users.forEach((u: any) => {
      userMap.set(u._id.toString(), u);
    });

    if (!task.reviewReply) {
      task.reviewReply = [] as any;
    }

    task.reviewReply?.push({
      reviewer: new Types.ObjectId(userId),
      comment,
      createdAt: new Date(),
    });

    const result = await this.taskModel
      .findByIdAndUpdate(id, { reviewReply: task.reviewReply }, { new: true })
      .populate("project")
      .lean();

    if (!result) {
      return {
        message: "Failed to add review reply",
        exception: "InternalServerErrorException",
      };
    }

    return {
      _id: result._id,
      name: result.name,
      project: result.project,
      dueDate: result.dueDate,
      priority: result.priority,
      description: result.description,
      status: result.status,
      createdBy: userMap.get(result.createdBy.toString())?.name,
      assignTo: result.assignTo.map(
        (id: any) => userMap.get(id.toString())?.name,
      ),
      dcrLinks: result.dcrLinks
        ? await Promise.all(
            result.dcrLinks.map(async (link) => {
              await getSignedUrl(link);
            }),
          )
        : undefined,
      dcrSubmissionStatus: result.dcrSubmissionStatus,
      dcrApprovedBy: userMap.get(result.dcrApprovedBy?.toString())?.name,
      dcrRejectedBy: userMap.get(result.dcrRejectedBy?.toString())?.name,
      reviewReply: result.reviewReply?.map((reply: any) => ({
        reviewer: userMap.get(reply.reviewer.toString())?.name,
        comment: reply.comment,
        createdAt: reply.createdAt,
      })),
    };
  }
}
