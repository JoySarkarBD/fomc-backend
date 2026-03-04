/**
 * @fileoverview Project Controller
 *
 * Microservice message pattern handlers for project management.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PROJECT_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { CreateProfileDto, UpdateProfileDto } from "./dto/profile.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Handle create_project message.
   *
   * @param {CreateProjectDto} createProjectDto - The project data to be created.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.CREATE_PROJECT)
  async create(@Payload() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  /**
   * Handle get_projects message.
   *
   * @param {SearchQueryDto} query - Search and pagination parameters.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_PROJECTS)
  async findAll(@Payload() query: SearchQueryDto) {
    return await this.projectService.findAll(query);
  }

  /**
   * Handle get_project message.
   *
   * @param {Object} payload - Object containing the project ID.
   * @param {string} payload.id - The ID of the project to retrieve.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_PROJECT)
  async findOne(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.findOne(payload.id);
  }

  /**
   * Handle update_project message.
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
   * Handle delete_project message.
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
   * Handle create_client message.
   *
   * @param {CreateClientDto} payload - Object containing client data.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.CREATE_CLIENT)
  async createClient(@Payload() payload: CreateClientDto) {
    return await this.projectService.createClient(payload.name);
  }

  /**
   * Handle get_clients message.
   *
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_CLIENTS)
  async findAllClients() {
    return await this.projectService.findAllClients();
  }

  /**
   * Handle update_client message.
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
   * Handle delete_client message.
   *
   * @param {Object} payload - Object containing client ID.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.DELETE_CLIENT)
  async deleteClient(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.deleteClient(payload.id);
  }

  /**
   * Handle create_profile message.
   *
   * @param {CreateProfileDto} payload - Object containing profile data.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.CREATE_PROFILE)
  async createProfile(@Payload() payload: CreateProfileDto) {
    return await this.projectService.createProfile(payload.name);
  }

  /**
   * Handle get_profiles message.
   *
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.GET_PROFILES)
  async findAllProfiles() {
    return await this.projectService.findAllProfiles();
  }

  /**
   * Handle update_profile message.
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
   * Handle delete_profile message.
   *
   * @param {Object} payload - Object containing profile ID.
   * @returns {Promise<any>}
   */
  @MessagePattern(PROJECT_COMMANDS.DELETE_PROFILE)
  async deleteProfile(@Payload() payload: { id: MongoIdDto["id"] }) {
    return await this.projectService.deleteProfile(payload.id);
  }
}
