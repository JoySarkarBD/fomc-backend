/**
 * @fileoverview Role gateway controller.
 *
 * Exposes CRUD endpoints for role management and delegates
 * business logic to RoleService.
 *
 * @module api-gateway/role
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
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import { CreateRoleDto } from "apps/user-service/src/role/dto/create-role.dto";
import { UpdateRoleDto } from "apps/user-service/src/role/dto/update-role.dto";
import { ApiStandardResponse } from "../common/decorators/api-standard-response";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  RoleCreateForbiddenDto,
  RoleDeleteForbiddenDto,
  RoleGetByIdForbiddenDto,
  RolesForbiddenDto,
  RoleUpdateForbiddenDto,
} from "./dto/role-forbidden.dto";
import {
  RoleCreateInternalErrorDto,
  RoleDeleteInternalErrorDto,
  RoleInternalErrorDto,
  RolesInternalErrorDto,
  RoleUpdateInternalErrorDto,
} from "./dto/role-internal-error.dto";
import {
  RoleDeleteByIdNotFoundDto,
  RoleNotFoundDto,
  RoleUpdateByIdNotFoundDto,
} from "./dto/role-not-found.dto";
import {
  RoleByIdSuccessDto,
  RoleCreateSuccessDto,
  RoleDeleteSuccessDto,
  RolePatchSuccessDto,
  RolesListSuccessDto,
} from "./dto/role-success.dto";
import {
  RoleCreateUnauthorizedDto,
  RoleDeleteUnauthorizedDto,
  RoleGetByIdUnauthorizedDto,
  RolesUnauthorizedDto,
  RoleUpdateUnauthorizedDto,
} from "./dto/role-unauthorized.dto";
import {
  RoleCreateValidationDto,
  RoleDeleteValidationDto,
  RoleGetByIdValidationDto,
  RolesValidationDto,
  RoleUpdateValidationDto,
} from "./dto/role-validation.dto";
import { RoleService } from "./role.service";

@ApiTags("Role")
@Controller("role")
@UseGuards(JwtAuthGuard)
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
  @ApiStandardResponse(RoleCreateSuccessDto, {
    status: 201,
    successDto: RoleCreateSuccessDto,
    validationDto: RoleCreateValidationDto,
    unauthorizedDto: RoleCreateUnauthorizedDto,
    forbiddenDto: RoleCreateForbiddenDto,
    internalServerErrorDto: RoleCreateInternalErrorDto,
    validation: true,
    unauthorized: true,
    forbidden: true,
    internalServerError: true,
  })
  @Post()
  async createRole(@Body() data: CreateRoleDto) {
    return await this.roleService.createRole(data);
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
  @ApiStandardResponse(RolesListSuccessDto, {
    status: 200,
    successDto: RolesListSuccessDto,
    unauthorizedDto: RolesUnauthorizedDto,
    forbiddenDto: RolesForbiddenDto,
    internalServerErrorDto: RolesInternalErrorDto,
    validationDto: RolesValidationDto,
    validation: true,
    isArray: true,
    unauthorized: true,
    forbidden: true,
    internalServerError: true,
  })
  @Get()
  async findRoles(@Query() query: SearchQueryDto) {
    return await this.roleService.findRoles(query);
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
  @ApiStandardResponse(RoleByIdSuccessDto, {
    status: 200,
    successDto: RoleByIdSuccessDto,
    validationDto: RoleGetByIdValidationDto,
    unauthorizedDto: RoleGetByIdUnauthorizedDto,
    forbiddenDto: RoleGetByIdForbiddenDto,
    notFoundDto: RoleNotFoundDto,
    internalServerErrorDto: RoleInternalErrorDto,
    validation: true,
    notFound: true,
    unauthorized: true,
    forbidden: true,
    internalServerError: true,
  })
  @Get(":id")
  async findRoleById(@Param() params: MongoIdDto) {
    return await this.roleService.findRoleById(params.id);
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
  @ApiStandardResponse(RolePatchSuccessDto, {
    status: 200,
    successDto: RolePatchSuccessDto,
    validationDto: RoleUpdateValidationDto,
    unauthorizedDto: RoleUpdateUnauthorizedDto,
    forbiddenDto: RoleUpdateForbiddenDto,
    notFoundDto: RoleUpdateByIdNotFoundDto,
    internalServerErrorDto: RoleUpdateInternalErrorDto,
    validation: true,
    notFound: true,
    unauthorized: true,
    forbidden: true,
    internalServerError: true,
  })
  @Patch(":id")
  async updateRoleById(
    @Param() params: MongoIdDto,
    @Body() data: UpdateRoleDto,
  ) {
    return await this.roleService.updateRoleById(params.id, data);
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
  @ApiStandardResponse(RoleDeleteSuccessDto, {
    status: 200,
    successDto: RoleDeleteSuccessDto,
    validationDto: RoleDeleteValidationDto,
    unauthorizedDto: RoleDeleteUnauthorizedDto,
    forbiddenDto: RoleDeleteForbiddenDto,
    notFoundDto: RoleDeleteByIdNotFoundDto,
    internalServerErrorDto: RoleDeleteInternalErrorDto,
    validation: true,
    notFound: true,
    unauthorized: true,
    forbidden: true,
    internalServerError: true,
  })
  @Delete(":id")
  async deleteRoleById(@Param() params: MongoIdDto) {
    return await this.roleService.deleteRoleById(params.id);
  }
}
