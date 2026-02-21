/**
 * @fileoverview Designation gateway controller.
 *
 * Exposes CRUD endpoints for designation management and delegates
 * business logic to DesignationService.
 *
 * @module api-gateway/designation
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
} from "@nestjs/common";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { CreateDesignationDto } from "apps/workforce-service/src/designation/dto/create-designation.dto";
import { UpdateDesignationDto } from "apps/workforce-service/src/designation/dto/update-designation.dto";
import { DesignationService } from "./designation.service";

@Controller("designation")
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  /**
   * Create a new designation.
   *
   * @param {CreateDesignationDto} createDesignationDto - The data transfer object containing the details of the designation to be created.
   * @returns Promise resolving to the newly created designation.
   */
  @Post()
  async createDesignation(@Body() createDesignationDto: CreateDesignationDto) {
    return await this.designationService.createDesignation(
      createDesignationDto,
    );
  }

  /**
   * Retrieve all designations based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @return Promise resolving to a list of designations matching the search criteria.
   */
  @Get()
  async findDesignations(@Query() query: SearchQueryDto) {
    return await this.designationService.findDesignations(query);
  }

  /**
   * Retrieve a single designation by ID.
   *
   * @param {string} id - The ID of the designation to be retrieved.
   * @return Promise resolving to the designation details.
   */
  @Get(":id")
  async findDesignationById(@Param() params: MongoIdDto) {
    return await this.designationService.findDesignationById(params.id);
  }

  /**
   * Update an existing designation by ID.
   *
   * @param {string} id - The ID of the designation to be updated.
   * @param {UpdateDesignationDto} updateDesignationDto - The data transfer object containing the updated details of the designation.
   * @return Promise resolving to the updated designation details.
   */
  @Patch(":id")
  async updateDesignationById(
    @Param() params: MongoIdDto,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return await this.designationService.updateDesignationById(
      params.id,
      updateDesignationDto,
    );
  }

  /**
   * Retrieve multiple designations by their IDs.
   *
   * @param {string[]} ids - An array of designation IDs to be retrieved.
   * @return Promise resolving to a list of designations matching the provided IDs.
   */
  @Get("batch")
  async findDesignationsByIds(@Query("ids") ids: string | string[]) {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    return await this.designationService.findDesignationsByIds(idsArray);
  }

  /**
   * Delete a designation by ID.
   *
   * @param {string} id - The ID of the designation to be deleted.
   * @return Promise resolving to a message indicating the result of the delete operation.
   */
  @Delete(":id")
  async deleteDesignationById(@Param() params: MongoIdDto) {
    return await this.designationService.deleteDesignationById(params.id);
  }
}
