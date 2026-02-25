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
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { CreateDesignationDto } from "apps/workforce-service/src/designation/dto/create-designation.dto";
import { UpdateDesignationDto } from "apps/workforce-service/src/designation/dto/update-designation.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { DesignationService } from "./designation.service";
import { DesignationListSuccessDto } from "./dto/designation-list-success.dto";
import { DesignationSuccessDto } from "./dto/designation-success.dto";

@ApiTags("Designation")
@Controller("designation")
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  /**
   * Create a new designation.
   *
   * @param {CreateDesignationDto} createDesignationDto - The data transfer object containing the details of the designation to be created.
   * @returns Promise resolving to the newly created designation.
   */
  @ApiOperation({
    summary: "Create designation",
    description: "Creates a new job designation in the organization.",
  })
  @ApiBearerAuth("authorization")
  @ApiSuccessResponse(DesignationSuccessDto, 201)
  @ApiErrorResponses({
    // unauthorized: CustomUnauthorizedDto,
    // internal: CustomInternalServerErrorDto,
  })
  @Roles("SUPER ADMIN")
  @UseGuards(JwtAuthGuard)
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
  @ApiOperation({
    summary: "List designations",
    description:
      "Retrieves a list of job designations with optional filtering.",
  })
  @ApiRequestDetails({
    queries: [
      {
        name: "pageNo",
        description: "The page number for pagination (1-based index)",
        required: true,
        type: Number,
        example: 1,
      },
      {
        name: "pageSize",
        description: "The number of items per page (1-100)",
        required: true,
        type: Number,
        example: 10,
      },
      {
        name: "searchKey",
        description: "Optional search term to filter designations",
        required: false,
        type: String,
        default: "",
        example: "manager",
      },
    ],
  })
  @ApiSuccessResponse(DesignationListSuccessDto, 200)
  @ApiErrorResponses({
    // unauthorized: CustomUnauthorizedDto,
    // internal: CustomInternalServerErrorDto,
  })
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
  @ApiOperation({
    summary: "Get designation by ID",
    description: "Retrieves details of a specific job designation.",
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the designation to retrieve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
  })
  @ApiSuccessResponse(DesignationSuccessDto, 200)
  @ApiErrorResponses({
    // notFound: CustomNotFoundDto,
    // unauthorized: CustomUnauthorizedDto,
    // internal: CustomInternalServerErrorDto,
  })
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
  @ApiOperation({
    summary: "Update designation",
    description: "Updates an existing job designation's details.",
  })
  @ApiBearerAuth("authorization")
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the designation to update",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
  })
  @ApiSuccessResponse(DesignationSuccessDto, 200)
  @ApiErrorResponses({
    // notFound: CustomNotFoundDto,
    // conflict: CustomConflictDto,
    // unauthorized: CustomUnauthorizedDto,
    // internal: CustomInternalServerErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles("SUPER ADMIN")
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
   * Delete a designation by ID.
   *
   * @param {string} id - The ID of the designation to be deleted.
   * @return Promise resolving to a message indicating the result of the delete operation.
   */
  @ApiOperation({
    summary: "Delete designation",
    description: "Deletes a job designation by its ID.",
  })
  @ApiBearerAuth("authorization")
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the designation to delete",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
  })
  @ApiSuccessResponse(DesignationSuccessDto, 200)
  @ApiErrorResponses({
    // notFound: CustomNotFoundDto,
    // unauthorized: CustomUnauthorizedDto,
    // internal: CustomInternalServerErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles("SUPER ADMIN")
  @Delete(":id")
  async deleteDesignationById(@Param() params: MongoIdDto) {
    return await this.designationService.deleteDesignationById(params.id);
  }
}
