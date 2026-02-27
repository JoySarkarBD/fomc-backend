/**
 * @fileoverview Designation Controller
 *
 * Handles all designation-related microservice message patterns in the
 * Workforce service. Supports CRUD operations on designations via TCP transport.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { DESIGNATION_COMMANDS } from "@shared/constants/designation-command.constants";
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import { DesignationService } from "./designation.service";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { UpdateDesignationDto } from "./dto/update-designation.dto";

/**
 * Designation Controller
 *
 * Handles all designation-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  /**
   * Create a new designation.
   *
   * Message Pattern: { cmd: DESIGNATION_COMMANDS.CREATE_DESIGNATION }
   * @param {CreateDesignationDto} createDesignationDto - The data transfer object containing the details of the designation to be created.
   * @returns {Promise<any>} Newly created designation.
   */
  @MessagePattern(DESIGNATION_COMMANDS.CREATE_DESIGNATION)
  async create(@Payload() createDesignationDto: CreateDesignationDto) {
    return await this.designationService.createDesignation(
      createDesignationDto,
    );
  }

  /**
   * Retrieve all designations based on the provided search query parameters.
   *
   * Message Pattern: { cmd: DESIGNATION_COMMANDS.GET_DESIGNATIONS }
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @returns {Promise<any>} List of designations matching the search criteria.
   */
  @MessagePattern(DESIGNATION_COMMANDS.GET_DESIGNATIONS)
  async findAll(@Payload() query: SearchQueryDto): Promise<any> {
    return await this.designationService.findDesignations(query);
  }

  /**
   * Retrieve a single designation by ID.
   *
   * Message Pattern: { cmd: DESIGNATION_COMMANDS.GET_DESIGNATION }
   * @param {MongoIdDto} payload - Object containing the designation ID.
   * @returns {Promise<any>} Designation details.
   */
  @MessagePattern(DESIGNATION_COMMANDS.GET_DESIGNATION)
  async findOne(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return await this.designationService.findDesignationById(id);
  }

  /**
   * Update an existing designation by ID.
   *
   * Message Pattern: { cmd: DESIGNATION_COMMANDS.UPDATE_DESIGNATION }
   * @param {Object} payload - Object containing the designation ID and the data to update.
   * @param {string} payload.id - The ID of the designation to be updated.
   * @param {UpdateDesignationDto} payload.data - The data transfer object containing the updated designation information.
   */
  @MessagePattern(DESIGNATION_COMMANDS.UPDATE_DESIGNATION)
  async update(
    @Payload() payload: { id: MongoIdDto["id"]; data: UpdateDesignationDto },
  ): Promise<any> {
    return await this.designationService.updateDesignationById(
      payload.id,
      payload.data,
    );
  }

  /**
   * Delete a designation by ID.
   *
   * Message Pattern: { cmd: DESIGNATION_COMMANDS.DELETE_DESIGNATION }
   * @param {MongoIdDto} payload - Object containing the designation ID to be deleted.
   * @returns {Promise<any>} Result of the delete operation.
   */
  @MessagePattern(DESIGNATION_COMMANDS.GET_DESIGNATIONS_BY_IDS)
  async findByIds(
    @Payload() payload: { ids: MongoIdDto["id"][] },
  ): Promise<any> {
    return await this.designationService.findDesignationsByIds(payload.ids);
  }

  /**
   * Delete a designation by ID.
   *
   * Message Pattern: { cmd: DESIGNATION_COMMANDS.DELETE_DESIGNATION }
   * @param {MongoIdDto} payload - Object containing the designation ID to be deleted.
   * @returns {Promise<any>} Result of the delete operation.
   */
  @MessagePattern(DESIGNATION_COMMANDS.DELETE_DESIGNATION)
  async remove(@Payload() id: MongoIdDto["id"]): Promise<any> {
    return await this.designationService.deleteDesignationById(id);
  }
}
