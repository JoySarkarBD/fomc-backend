/**
 * @fileoverview Designation gateway service.
 *
 * Sends TCP commands to the Workforce micro-service (which owns
 * departments) and normalises the response for the API layer.
 */

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { DESIGNATION_COMMANDS } from "@shared/constants/designation-command.constants";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { CreateDesignationDto } from "apps/workforce-service/src/designation-management/dto/create-designation.dto";
import { UpdateDesignationDto } from "apps/workforce-service/src/designation-management/dto/update-designation.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

@Injectable()
export class DesignationService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
  ) {}

  /**
   * Create a new designation.
   *
   * @param {CreateDesignationDto} data - The data transfer object containing the details of the designation to be created.
   * @return Promise resolving to the newly created designation.
   */
  async create(createDesignationDto: CreateDesignationDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(
        DESIGNATION_COMMANDS.CREATE_DESIGNATION,
        createDesignationDto,
      ),
    );
    this.handleException(result);
    return buildResponse("Designation created successfully", result);
  }

  /**
   * Find all designations.
   *
   * @param {SearchQueryDto} query - The search query parameters.
   * @returns Promise resolving to a list of designations matching the search criteria.
   */
  async findAll(query: SearchQueryDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(DESIGNATION_COMMANDS.GET_DESIGNATIONS, query),
    );
    return buildResponse("Designations retrieved successfully", result);
  }

  /**
   * Find a designation by ID.
   *
   * @param {string} id - The ID of the designation to be retrieved.
   * @return Promise resolving to the designation details.
   */
  async findOne(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(DESIGNATION_COMMANDS.GET_DESIGNATION, { id }),
    );
    if (!result) {
      throw new NotFoundException("Designation not found");
    }
    return buildResponse("Designation retrieved successfully", result);
  }

  /**
   * Update a designation by ID.
   *
   * @param {string} id - The ID of the designation to be updated.
   * @param {UpdateDesignationDto} updateDesignationDto - The data transfer object containing the updated details of the designation.
   * @return Promise resolving to the updated designation details.
   */
  async update(id: string, data: UpdateDesignationDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(DESIGNATION_COMMANDS.UPDATE_DESIGNATION, {
        id,
        data,
      }),
    );

    this.handleException(result);

    return buildResponse("Designation updated successfully", result);
  }

  /**
   * Delete a designation by ID.
   *
   * @param {string} id - The ID of the designation to be deleted.
   * @return Promise resolving to a message indicating the result of the delete operation.
   */
  async remove(id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(DESIGNATION_COMMANDS.DELETE_DESIGNATION, id),
    );

    this.handleException(result);

    return buildResponse("Designation deleted successfully", result);
  }

  /**
   * Handle exceptions from the Workforce micro-service responses.
   *
   * @param result - The response result from the Workforce micro-service, which may contain an exception field indicating an error.
   */
  private handleException(result: any) {
    if (result?.exception) {
      switch (result.exception) {
        case "NotFoundException":
          throw new NotFoundException(result.message);
        case "HttpException":
          throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        case "ConflictException":
          throw new HttpException(result.message, HttpStatus.CONFLICT);
        default:
          throw new HttpException(
            result.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }
}
