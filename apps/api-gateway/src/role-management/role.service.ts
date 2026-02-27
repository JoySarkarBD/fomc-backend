/**
 * @fileoverview Role gateway service.
 *
 * Sends TCP commands to the User micro-service (which owns roles)
 * and normalises the response for the API layer.
 */

import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ROLE_COMMANDS } from "@shared/constants/role-command.constants";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { UpdateRoleDto } from "apps/user-service/src/role-management/dto/update-role.dto";
import { firstValueFrom } from "rxjs";
import { CreateRoleDto } from "../../../user-service/src/role-management/dto/create-role.dto";
import { buildResponse } from "../common/response.util";

@Injectable()
export class RoleService {
  constructor(
    @Inject("USER_SERVICE") private readonly roleClient: ClientProxy,
  ) {}

  /**
   * Create a new role.
   *
   * @param {CreateRoleDto} data - The data transfer object containing the details of the role to be created.
   * @returns Promise resolving to the newly created role.
   */
  async create(data: CreateRoleDto) {
    const result = await firstValueFrom(
      this.roleClient.send(ROLE_COMMANDS.CREATE_ROLE, data),
    );
    switch (result?.exception) {
      case "Conflict":
        throw new ConflictException(result.message);
    }
    return buildResponse("Role created successfully", result);
  }

  /**
   * Retrieve all roles based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns Promise resolving to a list of roles matching the search criteria.
   */
  async findAll(query: SearchQueryDto) {
    const result = await firstValueFrom(
      this.roleClient.send(ROLE_COMMANDS.GET_ROLES, query),
    );
    return buildResponse("Roles fetched successfully", result);
  }

  /**
   * Retrieve a single role by ID.
   *
   * @param {string} id - The ID of the role to be retrieved.
   * @returns Promise resolving to the role details.
   */
  async findOne(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.roleClient.send(ROLE_COMMANDS.GET_ROLE, id),
    );
    if (!result) {
      throw new NotFoundException("No roles found");
    }
    return buildResponse("Role fetched successfully", result);
  }

  /**
   * Update an existing role by ID.
   *
   * @param {string} id - The ID of the role to be updated.
   * @param {UpdateRoleDto} data - The data transfer object containing the details of the role to be updated, including the role ID and the fields to be updated.
   * @returns Promise resolving to the updated role details.
   */
  async update(id: MongoIdDto["id"], data: UpdateRoleDto) {
    const result = await firstValueFrom(
      this.roleClient.send(ROLE_COMMANDS.UPDATE_ROLE, {
        id,
        data,
      }),
    );

    switch (result?.exception) {
      case "NotFoundException":
        throw new NotFoundException(result.message);
      case "Forbidden":
        throw new ForbiddenException(result.message);
      case "Conflict":
        throw new ConflictException(result.message);
    }

    return buildResponse("Role updated successfully", result);
  }

  /**
   * Delete a role by ID.
   *
   * @param {string} id - The ID of the role to be deleted.
   * @returns Promise resolving to the result of the delete operation.
   */
  async remove(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.roleClient.send(ROLE_COMMANDS.DELETE_ROLE, id),
    );

    switch (result?.exception) {
      case "Forbidden":
        throw new ForbiddenException(result.message);
      case "NotFoundException":
        throw new NotFoundException(result.message);
      case "Conflict":
        throw new ConflictException(result.message);
    }

    return buildResponse("Role deleted successfully", result);
  }
}
