/**
 * @fileoverview Role gateway controller.
 *
 * Exposes CRUD endpoints for role management and delegates
 * business logic to RoleService.
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
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import { CreateRoleDto } from "apps/user-service/src/role-management/dto/create-role.dto";
import { UpdateRoleDto } from "apps/user-service/src/role-management/dto/update-role.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  RoleCreateConflictDto,
  RoleUpdateConflictDto,
} from "./dto/error/role-conflict.dto";
import {
  RoleCreateForbiddenDto,
  RoleDeleteForbiddenDto,
  RoleUpdateForbiddenDto,
} from "./dto/error/role-forbidden.dto";
import {
  RoleCreateInternalErrorDto,
  RoleDeleteInternalErrorDto,
  RoleInternalErrorDto,
  RolesInternalErrorDto,
  RoleUpdateInternalErrorDto,
} from "./dto/error/role-internal-error.dto";
import {
  RoleDeleteByIdNotFoundDto,
  RoleNotFoundDto,
  RoleUpdateByIdNotFoundDto,
} from "./dto/error/role-not-found.dto";
import {
  RoleCreateUnauthorizedDto,
  RoleDeleteUnauthorizedDto,
  RoleUpdateUnauthorizedDto,
} from "./dto/error/role-unauthorized.dto";
import {
  RoleCreateValidationDto,
  RoleDeleteValidationDto,
  RoleGetByIdValidationDto,
  RolesValidationDto,
  RoleUpdateValidationDto,
} from "./dto/error/role-validation.dto";
import {
  RoleByIdSuccessDto,
  RoleCreateSuccessDto,
  RoleDeleteSuccessDto,
  RolePatchSuccessDto,
  RolesListSuccessDto,
} from "./dto/success/role-success.dto";
import { RoleService } from "./role.service";

@ApiTags("Role Management")
@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create a new role.
   *
   * @param {CreateRoleDto} data - The data transfer object containing the details of the role to be created.
   * @returns Promise resolving to the newly created role.
   */
  @ApiOperation({
    summary: "Create role",
    description: "Creates a new user role in the system.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(RoleCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: RoleCreateValidationDto,
    unauthorized: RoleCreateUnauthorizedDto,
    forbidden: RoleCreateForbiddenDto,
    conflict: RoleCreateConflictDto,
    internal: RoleCreateInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER ADMIN")
  @Post()
  async create(@Body() data: CreateRoleDto) {
    return await this.roleService.create(data);
  }

  /**
   * Retrieve all roles based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns Promise resolving to a list of roles matching the search criteria.
   */
  @ApiOperation({
    summary: "List roles",
    description: "Retrieves a list of user roles with optional filtering.",
  })
  @ApiRequestDetails({
    queries: [
      {
        name: "pageNo",
        description: "The page number for pagination",
        required: true,
        type: Number,
        example: 1,
      },
      {
        name: "pageSize",
        description: "The number of items per page for pagination",
        required: true,
        type: Number,
        example: 10,
      },
      {
        name: "searchKey",
        description: "Search term to filter roles by name or description",
        required: false,
        type: String,
        default: "",
        example: "admin",
      },
    ],
    queryDto: SearchQueryDto,
  })
  @ApiSuccessResponse(RolesListSuccessDto, 200)
  @ApiErrorResponses({
    validation: RolesValidationDto,
    internal: RolesInternalErrorDto,
  })
  @Get()
  async findAll(@Query() query: SearchQueryDto) {
    return await this.roleService.findAll(query);
  }

  /**
   * Retrieve a single role by ID.
   *
   * @param {string} id - The ID of the role to be retrieved.
   * @return Promise resolving to the role details.
   */
  @ApiOperation({
    summary: "Get role by ID",
    description: "Retrieves details of a specific user role.",
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the role to retrieve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(RoleByIdSuccessDto, 200)
  @ApiErrorResponses({
    validation: RoleGetByIdValidationDto,
    notFound: RoleNotFoundDto,
    internal: RoleInternalErrorDto,
  })
  @Get(":id")
  async findOne(@Param() params: MongoIdDto) {
    return await this.roleService.findOne(params.id);
  }

  /**
   * Update an existing role by ID.
   *
   * @param {UpdateRoleDto} data - The data transfer object containing the details of the role to be updated, including the role ID and the fields to be updated.
   * @return Promise resolving to the updated role details.
   */
  @ApiOperation({
    summary: "Update role",
    description: "Updates an existing user role's details.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the role to update",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(RolePatchSuccessDto, 200)
  @ApiErrorResponses({
    validation: RoleUpdateValidationDto,
    unauthorized: RoleUpdateUnauthorizedDto,
    forbidden: RoleUpdateForbiddenDto,
    notFound: RoleUpdateByIdNotFoundDto,
    conflict: RoleUpdateConflictDto,
    internal: RoleUpdateInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER ADMIN")
  @Patch(":id")
  async update(@Param() params: MongoIdDto, @Body() data: UpdateRoleDto) {
    return await this.roleService.update(params.id, data);
  }

  /**
   * Delete a role by ID.
   *
   * @param {MongoIdDto} payload - Object containing the role ID to be deleted.
   * @return Promise resolving to the result of the delete operation.
   */
  @ApiOperation({
    summary: "Delete role",
    description: "Deletes a user role by its ID.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the role to delete",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(RoleDeleteSuccessDto, 200)
  @ApiErrorResponses({
    validation: RoleDeleteValidationDto,
    unauthorized: RoleDeleteUnauthorizedDto,
    forbidden: RoleDeleteForbiddenDto,
    notFound: RoleDeleteByIdNotFoundDto,
    internal: RoleDeleteInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER ADMIN")
  @Delete(":id")
  async remove(@Param() params: MongoIdDto) {
    return await this.roleService.remove(params.id);
  }
}
