import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateRoleDto } from "apps/user-service/src/role/dto/update-role.dto";
import { firstValueFrom } from "rxjs";
import { ROLE_COMMANDS } from "../../../user-service/src/constants/role.constants";
import { CreateRoleDto } from "../../../user-service/src/role/dto/create-role.dto";
import { MongoIdDto } from "../common/dto/mongo-id.dto";
import { SearchQueryDto } from "../common/dto/search-query.dto";
import { buildResponse } from "../common/response.util";

/**
 * Role Service
 *
 * Handles communication with the Role microservice via ClientProxy.
 * Provides methods for CRUD operations on roles.
 */
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
  async createRole(data: CreateRoleDto) {
    const result = await firstValueFrom(
      this.roleClient.send(ROLE_COMMANDS.CREATE_ROLE, data),
    );
    if (result?.exception === "Conflict") {
      throw new HttpException(result.message, HttpStatus.CONFLICT);
    }
    return buildResponse("Role created successfully", result);
  }

  /**
   * Retrieve all roles based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns Promise resolving to a list of roles matching the search criteria.
   */
  async findRoles(query: SearchQueryDto) {
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
  async findRoleById(id: MongoIdDto["id"]) {
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
  async updateRoleById(id: MongoIdDto["id"], data: UpdateRoleDto) {
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
  async deleteRoleById(id: MongoIdDto["id"]) {
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
