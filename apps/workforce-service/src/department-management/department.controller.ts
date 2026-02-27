/**
 * @fileoverview Department Controller
 *
 * Handles all department-related microservice message patterns in the
 * Workforce service. Supports CRUD operations on departments via TCP transport.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { DEPARTMENT_COMMANDS } from "@shared/constants/department-command.constants";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

/**
 * Department Controller
 *
 * Handles all department-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Create a new department.
   *
   * Message Pattern: { cmd: DEPARTMENT_COMMANDS.CREATE_DEPARTMENT }
   * @param {CreateDepartmentDto} createDepartmentDto - The data transfer object containing the details of the department to be created.
   * @returns {Promise<any>} Newly created department.
   */
  @MessagePattern(DEPARTMENT_COMMANDS.CREATE_DEPARTMENT)
  async create(
    @Payload() createDepartmentDto: CreateDepartmentDto,
  ): Promise<any> {
    return await this.departmentService.createDepartment(createDepartmentDto);
  }

  /**
   * Retrieve all departments based on the provided search query parameters.
   *
   * Message Pattern: { cmd: DEPARTMENT_COMMANDS.GET_DEPARTMENTS }
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns {Promise<any>} List of departments matching the search criteria.
   */
  @MessagePattern(DEPARTMENT_COMMANDS.GET_DEPARTMENTS)
  async findAll(@Payload() query: SearchQueryDto): Promise<any> {
    return await this.departmentService.findDepartments(query);
  }

  /**
   * Retrieve a single department by ID.
   *
   * Message Pattern: { cmd: DEPARTMENT_COMMANDS.GET_DEPARTMENT }
   * @param {MongoIdDto} payload - Object containing the department ID.
   * @returns {Promise<any>} Department details.
   */
  @MessagePattern(DEPARTMENT_COMMANDS.GET_DEPARTMENT)
  async findOne(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return await this.departmentService.findDepartmentById(id);
  }

  /**
   * Update an existing department by ID.
   *
   * Message Pattern: { cmd: DEPARTMENT_COMMANDS.UPDATE_DEPARTMENT }
   * @param {Object} payload - Object containing the department ID and the data to update.
   * @param {string} payload.id - The ID of the department to be updated.
   * @param {UpdateDepartmentDto} payload.data - The data transfer object containing the updated department information.
   */
  @MessagePattern(DEPARTMENT_COMMANDS.UPDATE_DEPARTMENT)
  async update(
    @Payload() payload: { id: MongoIdDto["id"]; data: UpdateDepartmentDto },
  ): Promise<any> {
    return await this.departmentService.updateDepartmentById(
      payload.id,
      payload.data,
    );
  }

  /**
   * Delete a department by ID.
   *
   * Message Pattern: { cmd: DEPARTMENT_COMMANDS.DELETE_DEPARTMENT }
   * @param {MongoIdDto} payload - Object containing the department ID to be deleted.
   * @returns {Promise<any>} Result of the delete operation.
   */
  @MessagePattern(DEPARTMENT_COMMANDS.DELETE_DEPARTMENT)
  async remove(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return await this.departmentService.deleteDepartmentById(id);
  }
}
