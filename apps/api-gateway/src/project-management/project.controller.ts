/**
 * @fileoverview Project gateway controller.
 *
 * Exposes project-related HTTP endpoints.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { MongoIdDto } from "@shared/dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import type { AuthUser } from "@shared/interfaces";
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
import { ProjectStatus } from "apps/workforce-service/src/schemas/project.schema";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { SalesOnly } from "../common/decorators/department.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AccessGuard } from "../common/guards/access.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  ClientCreateForbiddenDto,
  ClientDeleteForbiddenDto,
  ClientListForbiddenDto,
  ClientUpdateForbiddenDto,
  ProfileCreateForbiddenDto,
  ProfileDeleteForbiddenDto,
  ProfileListForbiddenDto,
  ProfileUpdateForbiddenDto,
  ProjectByIdForbiddenDto,
  ProjectCreateForbiddenDto,
  ProjectDeleteForbiddenDto,
  ProjectListForbiddenDto,
  ProjectUpdateForbiddenDto,
} from "./dto/error/project-forbidden.dto";
import {
  ClientCreateInternalErrorDto,
  ClientDeleteInternalErrorDto,
  ClientListInternalErrorDto,
  ClientUpdateInternalErrorDto,
  ProfileCreateInternalErrorDto,
  ProfileDeleteInternalErrorDto,
  ProfileListInternalErrorDto,
  ProfileUpdateInternalErrorDto,
  ProjectByIdInternalErrorDto,
  ProjectCreateInternalErrorDto,
  ProjectDeleteInternalErrorDto,
  ProjectListInternalErrorDto,
  ProjectUpdateInternalErrorDto,
} from "./dto/error/project-internal-error.dto";
import {
  ClientDeleteNotFoundDto,
  ClientUpdateNotFoundDto,
  ProfileDeleteNotFoundDto,
  ProfileUpdateNotFoundDto,
  ProjectByIdNotFoundDto,
  ProjectDeleteNotFoundDto,
  ProjectUpdateNotFoundDto,
} from "./dto/error/project-not-found.dto";
import {
  ClientCreateUnauthorizedDto,
  ClientDeleteUnauthorizedDto,
  ClientListUnauthorizedDto,
  ClientUpdateUnauthorizedDto,
  ProfileCreateUnauthorizedDto,
  ProfileDeleteUnauthorizedDto,
  ProfileListUnauthorizedDto,
  ProfileUpdateUnauthorizedDto,
  ProjectByIdUnauthorizedDto,
  ProjectCreateUnauthorizedDto,
  ProjectDeleteUnauthorizedDto,
  ProjectListUnauthorizedDto,
  ProjectUpdateUnauthorizedDto,
} from "./dto/error/project-unauthorized.dto";
import {
  ClientCreateValidationDto,
  ClientDeleteValidationDto,
  ClientUpdateValidationDto,
  ProfileCreateValidationDto,
  ProfileDeleteValidationDto,
  ProfileUpdateValidationDto,
  ProjectByIdValidationDto,
  ProjectCreateValidationDto,
  ProjectDeleteValidationDto,
  ProjectListValidationDto,
  ProjectUpdateValidationDto,
} from "./dto/error/project-validation.dto";
import {
  ClientCreateSuccessDto,
  ClientDeleteSuccessDto,
  ClientListSuccessDto,
  ClientUpdateSuccessDto,
  ProfileCreateSuccessDto,
  ProfileDeleteSuccessDto,
  ProfileListSuccessDto,
  ProfileUpdateSuccessDto,
  ProjectByIdSuccessDto,
  ProjectCreateSuccessDto,
  ProjectDeleteSuccessDto,
  ProjectListSuccessDto,
  ProjectUpdateSuccessDto,
} from "./dto/success/project-success.dto";
import { ProjectService } from "./project.service";

@ApiTags("Project Management")
@UseGuards(JwtAuthGuard, AccessGuard)
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Create a new project.
   *
   * @param {CreateProjectDto} data - The project data.
   * @returns The newly created project.
   */
  @ApiOperation({
    summary: "Create project",
    description: "Creates a new project record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ProjectCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: ProjectCreateValidationDto,
    unauthorized: ProjectCreateUnauthorizedDto,
    forbidden: ProjectCreateForbiddenDto,
    internal: ProjectCreateInternalErrorDto,
  })
  @SalesOnly()
  @Post()
  async create(@GetUser() user: AuthUser, @Body() data: CreateProjectDto) {
    return await this.projectService.createProject(user, data);
  }

  /**
   * Get a list of projects based on query parameters.
   *
   * @param {SearchQueryDto} query - Pagination and filtering parameters.
   * @returns A list of projects.
   */
  @ApiOperation({
    summary: "List projects",
    description: "Retrieves a list of projects with optional filtering.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    queries: [
      {
        name: "pageNo",
        description: "The page number for pagination (1-based index)",
        required: true,
        type: Number,
      },
      {
        name: "pageSize",
        description: "The number of items per page for pagination",
        required: true,
        type: Number,
      },
      {
        name: "searchKey",
        description: "Search term to filter projects by name or order ID",
        required: false,
        type: String,
      },
      {
        name: "status",
        description: "Filter projects by status",
        required: false,
        type: String,
        enum: Object.values(ProjectStatus),
      },
    ],
  })
  @ApiSuccessResponse(ProjectListSuccessDto, 200)
  @ApiErrorResponses({
    validation: ProjectListValidationDto,
    unauthorized: ProjectListUnauthorizedDto,
    forbidden: ProjectListForbiddenDto,
    internal: ProjectListInternalErrorDto,
  })
  @SalesOnly()
  @Roles("PROJECT MANAGER", "TEAM LEADER")
  @Get()
  async findAll(@Query() query: SearchQueryDto & { status?: ProjectStatus }) {
    return await this.projectService.getProjects(query);
  }

  /**
   * Create a new client.
   */
  @ApiOperation({
    summary: "Create client",
    description: "Creates a new client record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ClientCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: ClientCreateValidationDto,
    unauthorized: ClientCreateUnauthorizedDto,
    forbidden: ClientCreateForbiddenDto,
    internal: ClientCreateInternalErrorDto,
  })
  @SalesOnly()
  @Post("client")
  async createClient(@Body() data: CreateClientDto) {
    return await this.projectService.createClient(data);
  }

  /**
   * Get all clients.
   */
  @ApiOperation({
    summary: "List clients",
    description: "Retrieves all clients.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ClientListSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: ClientListUnauthorizedDto,
    forbidden: ClientListForbiddenDto,
    internal: ClientListInternalErrorDto,
  })
  @SalesOnly()
  @Roles("PROJECT MANAGER", "TEAM LEADER")
  @Get("client")
  async getClients() {
    return await this.projectService.getClients();
  }

  /**
   * Create a new profile.
   */
  @ApiOperation({
    summary: "Create profile",
    description: "Creates a new profile record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ProfileCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: ProfileCreateValidationDto,
    unauthorized: ProfileCreateUnauthorizedDto,
    forbidden: ProfileCreateForbiddenDto,
    internal: ProfileCreateInternalErrorDto,
  })
  @SalesOnly()
  @Post("profile")
  async createProfile(@Body() data: CreateProfileDto) {
    return await this.projectService.createProfile(data);
  }

  /**
   * Get all profiles.
   */
  @ApiOperation({
    summary: "List profiles",
    description: "Retrieves all profiles.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ProfileListSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: ProfileListUnauthorizedDto,
    forbidden: ProfileListForbiddenDto,
    internal: ProfileListInternalErrorDto,
  })
  @SalesOnly()
  @Roles("PROJECT MANAGER", "TEAM LEADER")
  @Get("profile")
  async getProfiles() {
    return await this.projectService.getProfiles();
  }

  /**
   * Get a single project by its ID.
   *
   * @param {MongoIdDto} params - Object containing the project ID.
   * @returns The project details.
   */
  @ApiOperation({
    summary: "Get project by ID",
    description: "Retrieves details of a specific project.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the project to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ProjectByIdSuccessDto, 200)
  @ApiErrorResponses({
    validation: ProjectByIdValidationDto,
    unauthorized: ProjectByIdUnauthorizedDto,
    forbidden: ProjectByIdForbiddenDto,
    notFound: ProjectByIdNotFoundDto,
    internal: ProjectByIdInternalErrorDto,
  })
  @SalesOnly()
  @Roles("PROJECT MANAGER", "TEAM LEADER")
  @Get(":id")
  async findOne(@Param() params: MongoIdDto) {
    return await this.projectService.getProject(params.id);
  }

  /**
   * Update an existing project.
   *
   * @param {MongoIdDto} params - Object containing the project ID.
   * @param {UpdateProjectDto} data - The data to update.
   * @returns The updated project.
   */
  @ApiOperation({
    summary: "Update project",
    description: "Updates an existing project record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the project to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ProjectUpdateSuccessDto, 200)
  @ApiErrorResponses({
    validation: ProjectUpdateValidationDto,
    unauthorized: ProjectUpdateUnauthorizedDto,
    forbidden: ProjectUpdateForbiddenDto,
    notFound: ProjectUpdateNotFoundDto,
    internal: ProjectUpdateInternalErrorDto,
  })
  @SalesOnly()
  @Patch(":id")
  async update(@Param() params: MongoIdDto, @Body() data: UpdateProjectDto) {
    return await this.projectService.updateProject(params.id, data);
  }

  /**
   * Delete a project.
   *
   * @param {MongoIdDto} params - Object containing the project ID.
   * @returns The deletion result.
   */
  @ApiOperation({
    summary: "Delete project",
    description: "Deletes a project record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the project to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ProjectDeleteSuccessDto, 200)
  @ApiErrorResponses({
    validation: ProjectDeleteValidationDto,
    unauthorized: ProjectDeleteUnauthorizedDto,
    forbidden: ProjectDeleteForbiddenDto,
    notFound: ProjectDeleteNotFoundDto,
    internal: ProjectDeleteInternalErrorDto,
  })
  @SalesOnly()
  @Delete(":id")
  async remove(@Param() params: MongoIdDto) {
    return await this.projectService.deleteProject(params.id);
  }

  /**
   * Update a client.
   */
  @ApiOperation({
    summary: "Update client",
    description: "Updates an existing client record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the project to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ClientUpdateSuccessDto, 200)
  @ApiErrorResponses({
    validation: ClientUpdateValidationDto,
    unauthorized: ClientUpdateUnauthorizedDto,
    forbidden: ClientUpdateForbiddenDto,
    notFound: ClientUpdateNotFoundDto,
    internal: ClientUpdateInternalErrorDto,
  })
  @SalesOnly()
  @Patch("client/:id")
  async updateClient(
    @Param() params: MongoIdDto,
    @Body() data: UpdateClientDto,
  ) {
    return await this.projectService.updateClient(params.id, data);
  }

  /**
   * Delete a client.
   */
  @ApiOperation({
    summary: "Delete client",
    description: "Deletes a client record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the client to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ClientDeleteSuccessDto, 200)
  @ApiErrorResponses({
    validation: ClientDeleteValidationDto,
    unauthorized: ClientDeleteUnauthorizedDto,
    forbidden: ClientDeleteForbiddenDto,
    notFound: ClientDeleteNotFoundDto,
    internal: ClientDeleteInternalErrorDto,
  })
  @SalesOnly()
  @Delete("client/:id")
  async deleteClient(@Param() params: MongoIdDto) {
    return await this.projectService.deleteClient(params.id);
  }

  /**
   * Update a profile.
   */
  @ApiOperation({
    summary: "Update profile",
    description: "Updates an existing profile record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the profile to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ProfileUpdateSuccessDto, 200)
  @ApiErrorResponses({
    validation: ProfileUpdateValidationDto,
    unauthorized: ProfileUpdateUnauthorizedDto,
    forbidden: ProfileUpdateForbiddenDto,
    notFound: ProfileUpdateNotFoundDto,
    internal: ProfileUpdateInternalErrorDto,
  })
  @SalesOnly()
  @Patch("profile/:id")
  async updateProfile(
    @Param() params: MongoIdDto,
    @Body() data: UpdateProfileDto,
  ) {
    return await this.projectService.updateProfile(params.id, data);
  }

  /**
   * Delete a profile.
   */
  @ApiOperation({
    summary: "Delete profile",
    description: "Deletes a profile record.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: [
      {
        name: "id",
        description: "The ID of the profile to retrieve",
        required: true,
        type: String,
      },
    ],
  })
  @ApiSuccessResponse(ProfileDeleteSuccessDto, 200)
  @ApiErrorResponses({
    validation: ProfileDeleteValidationDto,
    unauthorized: ProfileDeleteUnauthorizedDto,
    forbidden: ProfileDeleteForbiddenDto,
    notFound: ProfileDeleteNotFoundDto,
    internal: ProfileDeleteInternalErrorDto,
  })
  @SalesOnly()
  @Delete("profile/:id")
  async deleteProfile(@Param() params: MongoIdDto) {
    return await this.projectService.deleteProfile(params.id);
  }
}
