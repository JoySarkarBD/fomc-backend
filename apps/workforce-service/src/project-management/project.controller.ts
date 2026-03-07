/**
 * @fileoverview Project Controller
 *
 * Handles incoming messages related to project management in the Workforce microservice. Defines message patterns for creating, retrieving, updating, and deleting projects, clients, and profiles. Delegates business logic to the ProjectService.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PROJECT_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import type { AuthUser } from "@shared/interfaces/auth-user.interface";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { CreateProfileDto, UpdateProfileDto } from "./dto/profile.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

/**
 * Project Controller
 *
 * Handles all project-related microservice message patterns in the
 * Workforce service. Supports CRUD operations on projects, clients, and profiles via TCP transport.
 */
@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Create a new project.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.CREATE_PROJECT }
   *
   * @param {CreateProjectDto} createProjectDto - The project data to be created.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.CREATE_PROJECT)
  async create(
    @Payload() payload: { user: AuthUser; createProjectDto: CreateProjectDto },
  ) {
    return await this.projectService.create(
      payload.user,
      payload.createProjectDto,
    );
  }

  /**
   * Retrieve projects message with pagination and search.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.GET_PROJECTS }
   *
   * @param {SearchQueryDto} query - Search and pagination parameters.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_PROJECTS)
  async findAll(@Payload() query: SearchQueryDto) {
    return await this.projectService.findAll(query);
  }

  /**
   * Get project by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.GET_PROJECT }
   *
   * @param {Object} payload - Object containing the project ID.
   * @param {Object} payload - Object containing the project ID.
   * @param {string} payload.id - The ID of the project to retrieve.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_PROJECT)
  async findOne(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.findOne(payload.id);
  }

  /**
   * Update project by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.UPDATE_PROJECT }
   *
   * @param {UpdateProjectDto} payload - The project update data including ID.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.UPDATE_PROJECT)
  async update(
    @Payload() payload: { id: MongoIdDto["id"]; data: UpdateProjectDto },
  ) {
    return await this.projectService.update(payload.id, payload.data);
  }

  /**
   * Delete project by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.DELETE_PROJECT }
   *
   * @param {Object} payload - Object containing the project ID.
   * @param {string} payload.id - The ID of the project to delete.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.DELETE_PROJECT)
  async remove(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.remove(payload.id);
  }

  /**
   * Create a new client.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.CREATE_CLIENT }
   *
   * @param {CreateClientDto} payload - Object containing client data.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.CREATE_CLIENT)
  async createClient(@Payload() payload: CreateClientDto) {
    return await this.projectService.createClient(payload.name);
  }

  /**
   * Get all clients.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.GET_CLIENTS }
   *
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_CLIENTS)
  async findAllClients() {
    return await this.projectService.findAllClients();
  }

  /**
   * Update client by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.UPDATE_CLIENT }
   *
   * @param {UpdateClientDto} payload - Object containing client ID and update data.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.UPDATE_CLIENT)
  async updateClient(
    @Payload() payload: { id: MongoIdDto["id"]; data: UpdateClientDto },
  ) {
    return await this.projectService.updateClient(payload.id, payload.data);
  }

  /**
   * Delete client by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.DELETE_CLIENT }
   *
   * @param {Object} payload - Object containing client ID.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.DELETE_CLIENT)
  async deleteClient(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.deleteClient(payload.id);
  }

  /**
   * Create a new profile.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.CREATE_PROFILE }
   *
   * @param {CreateProfileDto} payload - Object containing profile data.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.CREATE_PROFILE)
  async createProfile(@Payload() payload: CreateProfileDto) {
    return await this.projectService.createProfile(payload.name);
  }

  /**
   * Get all profiles.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.GET_PROFILES }
   *
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_PROFILES)
  async findAllProfiles() {
    return await this.projectService.findAllProfiles();
  }

  /**
   * Update profile by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.UPDATE_PROFILE }
   *
   * @param {UpdateProfileDto} payload - Object containing profile ID and update data.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.UPDATE_PROFILE)
  async updateProfile(
    @Payload()
    payload: {
      id: MongoIdDto["id"];
      data: UpdateProfileDto;
    },
  ) {
    return await this.projectService.updateProfile(payload.id, payload.data);
  }

  /**
   * Delete profile by its ID.
   *
   * Message Pattern: { cmd: PROJECT_COMMANDS.DELETE_PROFILE }
   *
   * @param {Object} payload - Object containing profile ID.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.DELETE_PROFILE)
  async deleteProfile(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.deleteProfile(payload.id);
  }
}
