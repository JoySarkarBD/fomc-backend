/**
 * @fileoverview Project Service
 *
 * Business logic for project CRUD operations in the Workforce microservice.
 * Provides methods to create, retrieve (paginated), find by ID, update, and
 * delete projects with safety checks.
 */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoIdDto } from "@shared/dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import type { AuthUser } from "@shared/interfaces/auth-user.interface";
import { Model, Types } from "mongoose";
import { Department, DepartmentDocument } from "../schemas/department.schema";
import {
  Client,
  Profile,
  Project,
  ProjectDocument,
  ProjectStatus,
} from "../schemas/project.schema";
import { UpdateClientDto } from "./dto/client.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProfileDto } from "./dto/profile.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  /**
   * Validates if the provided IDs for client, profile, and department exist.
   *
   * @param {Object} ids - Object containing optional IDs to validate.
   * @returns {Promise<{ message: string; exception: string } | null>}
   */
  private async validateReferences(ids: {
    client?: string;
    profile?: string;
    assignedDepartment?: string;
  }) {
    if (ids.client) {
      const exists = await this.clientModel.findById(ids.client);
      if (!exists) {
        return { message: "Client not found", exception: "NotFoundException" };
      }
    }

    if (ids.profile) {
      const exists = await this.profileModel.findById(ids.profile);
      if (!exists) {
        return { message: "Profile not found", exception: "NotFoundException" };
      }
    }

    if (ids.assignedDepartment) {
      const exists = await this.departmentModel.findById(
        ids.assignedDepartment,
      );
      if (!exists) {
        return {
          message: "Department not found",
          exception: "NotFoundException",
        };
      }
    }

    return null;
  }

  /**
   * Create a new project in the database.
   *
   * @param {AuthUser} user - The authenticated user creating the project.
   * @param {CreateProjectDto} createProjectDto - The data transfer object containing the details of the project to be created.
   * @returns {Promise<any>} The newly created project or an error message if a project with the same orderId already exists.
   */
  async create(user: AuthUser, createProjectDto: CreateProjectDto) {
    // Check if project with the same orderId already exists
    const existingProject = await this.projectModel.findOne({
      orderId: createProjectDto.orderId,
    });

    if (existingProject) {
      return {
        message: "Project with the same orderId already exists",
        exception: "Conflict",
      };
    }

    // Validate references
    const validationError = await this.validateReferences({
      client: createProjectDto.client,
      profile: createProjectDto.profile,
      assignedDepartment: createProjectDto.assignedDepartment,
    });

    if (validationError) {
      return validationError;
    }

    return await this.projectModel.create({
      ...createProjectDto,
      client: createProjectDto.client
        ? new Types.ObjectId(createProjectDto.client)
        : undefined,
      profile: createProjectDto.profile
        ? new Types.ObjectId(createProjectDto.profile)
        : undefined,
      assignedDepartment: createProjectDto.assignedDepartment
        ? new Types.ObjectId(createProjectDto.assignedDepartment)
        : undefined,
      createdBy: new Types.ObjectId(user.id),
    });
  }

  /**
   * Retrieve a paginated list of projects based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns {Promise<{ projects: any[]; total: number; totalPages: number }>}
   */
  async findAll(query: SearchQueryDto & { status?: ProjectStatus }) {
    let { pageNo, pageSize, status } = query;
    const searchKey =
      typeof query.searchKey === "string" ? query.searchKey : "";

    // Ensure pageNo and pageSize are numbers
    pageNo = Number(pageNo) || 1;
    pageSize = Number(pageSize) || 10;

    // Build $match filter
    const matchFilter: any = {};
    if (searchKey) {
      matchFilter.$or = [
        { name: { $regex: searchKey, $options: "i" } },
        { orderId: { $regex: searchKey, $options: "i" } },
        { "client.name": { $regex: searchKey, $options: "i" } },
        { "profile.name": { $regex: searchKey, $options: "i" } },
      ];
    }
    if (status) {
      matchFilter.status = status;
    }

    const aggregation = await this.projectModel.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "assignedDepartment",
          foreignField: "_id",
          as: "assignedDepartment",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$assignedDepartment",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchFilter },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: (pageNo - 1) * pageSize }, { $limit: pageSize }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const projects = aggregation[0].data;
    const total = aggregation[0].totalCount[0]?.count || 0;

    return {
      projects,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieve a single project by its unique identifier.
   *
   * @param {string} id - The unique identifier of the project to be retrieved.
   * @returns {Promise<any>}
   */
  async findOne(id: MongoIdDto["id"]) {
    const project = await this.projectModel
      .findById(id)
      .populate("client")
      .populate("profile")
      .populate("assignedDepartment")
      .exec();

    if (!project) {
      return {
        message: "Project not found",
        exception: "NotFoundException",
      };
    }

    return project;
  }

  /**
   * Update an existing project by its unique identifier.
   *
   * @param {string} id - The unique identifier of the project to be updated.
   * @param {UpdateProjectDto} updateProjectDto - The data transfer object containing the details of the project to be updated.
   * @returns {Promise<any>}
   */
  async update(id: MongoIdDto["id"], updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      return {
        message: "Project not found",
        exception: "NotFoundException",
      };
    }

    if (
      updateProjectDto.orderId &&
      updateProjectDto.orderId !== project.orderId
    ) {
      const duplicateProject = await this.projectModel.findOne({
        orderId: updateProjectDto.orderId,
      });

      if (duplicateProject) {
        return {
          message: "Project with the same orderId already exists",
          exception: "Conflict",
        };
      }
    }

    // Validate references
    const validationError = await this.validateReferences({
      client: updateProjectDto.client,
      profile: updateProjectDto.profile,
      assignedDepartment: updateProjectDto.assignedDepartment,
    });

    if (validationError) {
      return validationError;
    }

    return await this.projectModel.findByIdAndUpdate(
      id,
      {
        name: updateProjectDto.name ? updateProjectDto.name : project.name,
        client: updateProjectDto.client
          ? updateProjectDto.client
          : project.client,
        orderId: updateProjectDto.orderId
          ? updateProjectDto.orderId
          : project.orderId,
        profile: updateProjectDto.profile
          ? updateProjectDto.profile
          : project.profile,
        assignedDepartment: updateProjectDto.assignedDepartment
          ? updateProjectDto.assignedDepartment
          : project.assignedDepartment,
        projectTeam: updateProjectDto.projectTeam
          ? updateProjectDto.projectTeam
          : project.projectTeam,
        projectFiles: updateProjectDto.projectFiles
          ? updateProjectDto.projectFiles
          : project.projectFiles,
        projectRemarks: updateProjectDto.projectRemarks
          ? updateProjectDto.projectRemarks
          : project.projectRemarks,
        dueDate: updateProjectDto.dueDate
          ? updateProjectDto.dueDate
          : project.dueDate,
        deliveryDate: updateProjectDto.deliveryDate
          ? updateProjectDto.deliveryDate
          : project.deliveryDate,
        status: updateProjectDto.status
          ? updateProjectDto.status
          : project.status,
      },
      {
        new: true,
      },
    );
  }

  /**
   * Delete a project by its ID.
   *
   * @param {string} id - The unique identifier of the project to be deleted.
   * @returns {Promise<any>}
   */
  async remove(id: MongoIdDto["id"]) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      return {
        message: "Project not found",
        exception: "NotFoundException",
      };
    }

    return await this.projectModel.findByIdAndDelete(id);
  }

  // Basic management for Clients and Profiles if they are needed by the project creation flow

  async createClient(name: string) {
    return await this.clientModel.create({ name });
  }

  async findAllClients() {
    return await this.clientModel.find().exec();
  }

  async updateClient(id: MongoIdDto["id"], data: UpdateClientDto) {
    const client = await this.clientModel.findById(id);
    if (!client) {
      return { message: "Client not found", exception: "NotFoundException" };
    }
    return await this.clientModel.findByIdAndUpdate(
      id,
      { name: data.name },
      { new: true },
    );
  }

  async deleteClient(id: MongoIdDto["id"]) {
    const client = await this.clientModel.findById(id);
    if (!client) {
      return { message: "Client not found", exception: "NotFoundException" };
    }
    // Check if client is assigned to any project
    const projectCount = await this.projectModel.countDocuments({ client: id });
    if (projectCount > 0) {
      return {
        message: "Client is associated with projects and cannot be deleted",
        exception: "Forbidden",
      };
    }
    return await this.clientModel.findByIdAndDelete(id);
  }

  async createProfile(name: string) {
    return await this.profileModel.create({ name });
  }

  async findAllProfiles() {
    return await this.profileModel.find().exec();
  }

  async updateProfile(id: MongoIdDto["id"], data: UpdateProfileDto) {
    const profile = await this.profileModel.findById(id);
    if (!profile) {
      return { message: "Profile not found", exception: "NotFoundException" };
    }
    return await this.profileModel.findByIdAndUpdate(
      id,
      { name: data.name },
      { new: true },
    );
  }

  async deleteProfile(id: MongoIdDto["id"]) {
    const profile = await this.profileModel.findById(id);
    if (!profile) {
      return { message: "Profile not found", exception: "NotFoundException" };
    }
    // Check if profile is assigned to any project
    const projectCount = await this.projectModel.countDocuments({
      profile: id,
    });
    if (projectCount > 0) {
      return {
        message: "Profile is associated with projects and cannot be deleted",
        exception: "Forbidden",
      };
    }
    return await this.profileModel.findByIdAndDelete(id);
  }
}
