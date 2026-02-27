/** @fileoverview Role controller. Handles role-related microservice message patterns (CRUD). @module user-service/role/role.controller */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ROLE_COMMANDS } from "@shared/constants/role-command.constants";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleService } from "./role.service";

/**
 * Role Controller
 *
 * Handles all role-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create a new role.
   *
   * Message Pattern: { cmd: ROLE_COMMANDS.CREATE_ROLE }
   *
   * @param {CreateRoleDto} createRoleDto - The data transfer object containing the details of the role to be created.
   * @returns {Promise<any>} Newly created role.
   */
  @MessagePattern(ROLE_COMMANDS.CREATE_ROLE)
  create(@Payload() createRoleDto: CreateRoleDto): Promise<any> {
    return this.roleService.createRole(createRoleDto);
  }

  /**
   * Retrieve all roles based on the provided search query parameters.
   *
   * Message Pattern: { cmd: ROLE_COMMANDS.GET_ROLES }
   *
   * @param {any} query - The search query parameters for filtering and pagination.
   * @returns {Promise<any>} List of roles matching the search criteria.
   */
  @MessagePattern(ROLE_COMMANDS.GET_ROLES)
  findAll(@Payload() query: SearchQueryDto): Promise<any> {
    return this.roleService.findRoles(query);
  }

  /**
   * Retrieve a single role by ID.
   *
   * Message Pattern: { cmd: ROLE_COMMANDS.GET_ROLE }
   *
   * @param {MongoIdDto} payload - Object containing the role ID.
   * @returns {Promise<any>} Role details.
   */
  @MessagePattern(ROLE_COMMANDS.GET_ROLE)
  findOne(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return this.roleService.findRoleById(id);
  }

  /**
   * Update an existing role by ID.
   *
   * Message Pattern: { cmd: ROLE_COMMANDS.UPDATE_ROLE }
   *
   * @param {Object} payload - Object containing the role ID and the data to update.
   * @param {MongoIdDto["id"]} payload.id - The ID of the role to be updated.
   * @param {UpdateRoleDto} payload.data - The data transfer object containing the details of the role to be updated, including the fields to be updated.
   * @returns {Promise<any>} Updated role details.
   */
  @MessagePattern(ROLE_COMMANDS.UPDATE_ROLE)
  update(
    @Payload() payload: { id: MongoIdDto["id"]; data: UpdateRoleDto },
  ): Promise<any> {
    return this.roleService.updateRoleById(payload.id, payload.data);
  }

  /**
   * Delete a role by ID.
   *
   * Message Pattern: { cmd: ROLE_COMMANDS.DELETE_ROLE }
   *
   * @param {MongoIdDto} payload - Object containing the role ID to be deleted.
   * @returns {Promise<any>} Result of the delete operation.
   */
  @MessagePattern(ROLE_COMMANDS.DELETE_ROLE)
  remove(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return this.roleService.deleteRoleById(id);
  }
}
