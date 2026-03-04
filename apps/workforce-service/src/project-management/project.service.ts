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
import { Model } from "mongoose";
import {
  Client,
  Profile,
  Project,
  ProjectDocument,
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
  ) {}

  /**
   * Create a new project in the database.
   *
   * @param {CreateProjectDto} createProjectDto - The data transfer object containing the details of the project to be created.
   * @returns {Promise<any>} The newly created project or an error message if a project with the same orderId already exists.
   */
  async create(createProjectDto: CreateProjectDto) {
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

    return await this.projectModel.create(createProjectDto);
  }

  /**
   * Retrieve a paginated list of projects based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns {Promise<{ projects: any[]; total: number; totalPages: number }>}
   */
  async findAll(query: SearchQueryDto) {
    const { pageNo, pageSize } = query;
    const searchKey =
      typeof query.searchKey === "string" ? query.searchKey : "";

    const [projects, total] = await Promise.all([
      this.projectModel
        .find({
          $or: [
            { name: { $regex: searchKey, $options: "i" } },
            { orderId: { $regex: searchKey, $options: "i" } },
          ],
        })
        .populate("client")
        .populate("profile")
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .exec(),
      this.projectModel.countDocuments({
        $or: [
          { name: { $regex: searchKey, $options: "i" } },
          { orderId: { $regex: searchKey, $options: "i" } },
        ],
      }),
    ]);

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

    return await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    });
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
