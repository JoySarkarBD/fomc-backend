/**
 * @fileoverview Project gateway service.
 *
 * Handles communication with the Workforce micro-service via TCP ClientProxy.
 */
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PROJECT_COMMANDS } from "@shared/constants";
import { MongoIdDto } from "@shared/dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { handleException } from "@shared/utils/handle.exception";
import {
  CreateClientDto,
  UpdateClientDto,
} from "apps/workforce-service/src/project-management/dto/client.dto";
import { CreateProjectDto } from "apps/workforce-service/src/project-management/dto/create-project.dto";
import {
  CreateProfileDto,
  UpdateProfileDto,
} from "apps/workforce-service/src/project-management/dto/profile.dto";
import { UpdateProjectDto } from "apps/workforce-service/src/project-management/dto/update-project.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class ProjectService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
  ) {}

  /**
   * Create a new project.
   *
   * @param {CreateProjectDto} data - The project data.
   * @returns {Promise<any>}
   */
  async createProject(data: CreateProjectDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.CREATE_PROJECT, data),
    );

    handleException(result);

    return buildResponse("Project created successfully", result);
  }

  /**
   * Fetch all projects.
   *
   * @param {SearchQueryDto} query - Search and pagination parameters.
   * @returns {Promise<any>}
   */
  async getProjects(query: SearchQueryDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.GET_PROJECTS, query),
    );

    return buildResponse("Projects fetched successfully", result);
  }

  /**
   * Fetch a single project by ID.
   *
   * @param {string} id - The project ID.
   * @returns {Promise<any>}
   */
  async getProject(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.GET_PROJECT, { id }),
    );

    if (result.exception === "NotFoundException") {
      throw new NotFoundException("Project not found");
    }

    handleException(result);

    return buildResponse("Project fetched successfully", result);
  }

  /**
   * Update an existing project.
   *
   * @param {string} id - The project ID.
   * @param {UpdateProjectDto} data - The update data.
   * @returns {Promise<any>}
   */
  async updateProject(id: MongoIdDto["id"], data: UpdateProjectDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.UPDATE_PROJECT, {
        id,
        data,
      }),
    );

    handleException(result);

    return buildResponse("Project updated successfully", result);
  }

  /**
   * Delete a project.
   *
   * @param {string} id - The project ID.
   * @returns {Promise<any>}
   */
  async deleteProject(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.DELETE_PROJECT, { id }),
    );

    handleException(result);

    return buildResponse("Project deleted successfully", result);
  }

  /**
   * Create a new client.
   *
   * @param {CreateClientDto} data - The client data.
   * @returns {Promise<any>}
   */
  async createClient(data: CreateClientDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.CREATE_CLIENT, data),
    );

    handleException(result);

    return buildResponse("Client created successfully", result);
  }

  /**
   * Fetch all clients.
   *
   * @returns {Promise<any>}
   */
  async getClients() {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.GET_CLIENTS, {}),
    );

    return buildResponse("Clients fetched successfully", result);
  }

  /**
   * Update an existing client.
   *
   * @param {string} id - The client ID.
   * @param {UpdateClientDto} data - The update data.
   * @returns {Promise<any>}
   */
  async updateClient(id: MongoIdDto["id"], data: UpdateClientDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.UPDATE_CLIENT, {
        id,
        data,
      }),
    );

    handleException(result);

    return buildResponse("Client updated successfully", result);
  }

  /**
   * Delete a client.
   *
   * @param {string} id - The client ID.
   * @returns {Promise<any>}
   */
  async deleteClient(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.DELETE_CLIENT, { id }),
    );

    handleException(result);

    return buildResponse("Client deleted successfully", result);
  }

  /**
   * Create a new profile.
   *
   * @param {CreateProfileDto} data - The profile data.
   * @returns {Promise<any>}
   */
  async createProfile(data: CreateProfileDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.CREATE_PROFILE, data),
    );

    handleException(result);

    return buildResponse("Profile created successfully", result);
  }

  /**
   * Fetch all profiles.
   *
   * @returns {Promise<any>}
   */
  async getProfiles() {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.GET_PROFILES, {}),
    );

    return buildResponse("Profiles fetched successfully", result);
  }

  /**
   * Update an existing profile.
   *
   * @param {string} id - The profile ID.
   * @param {UpdateProfileDto} data - The update data.
   * @returns {Promise<any>}
   */
  async updateProfile(id: MongoIdDto["id"], data: UpdateProfileDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.UPDATE_PROFILE, {
        id,
        data,
      }),
    );

    handleException(result);

    return buildResponse("Profile updated successfully", result);
  }

  /**
   * Delete a profile.
   *
   * @param {string} id - The profile ID.
   * @returns {Promise<any>}
   */
  async deleteProfile(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(PROJECT_COMMANDS.DELETE_PROFILE, { id }),
    );

    handleException(result);

    return buildResponse("Profile deleted successfully", result);
  }
}
