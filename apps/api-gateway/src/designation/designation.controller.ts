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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
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
import {
  DesignationCreateConflictDto,
  DesignationUpdateConflictDto,
} from "./dto/error/designation-conflict.dto";
import {
  DesignationCreateForbiddenDto,
  DesignationUpdateForbiddenDto,
} from "./dto/error/designation-forbidden.dto";
import {
  DesignationCreateInternalErrorDto,
  DesignationDeleteInternalErrorDto,
  DesignationInternalErrorDto,
  DesignationsInternalErrorDto,
  DesignationUpdateInternalErrorDto,
} from "./dto/error/designation-internal-error.dto";
import {
  DesignationDeleteByIdNotFoundDto,
  DesignationNotFoundDto,
  DesignationUpdateByIdNotFoundDto,
} from "./dto/error/designation-not-found.dto";
import {
  DesignationCreateUnauthorizedDto,
  DesignationDeleteUnauthorizedDto,
  DesignationUpdateUnauthorizedDto,
} from "./dto/error/designation-unauthorized.dto";
import {
  DesignationCreateValidationDto,
  DesignationDeleteValidationDto,
  DesignationGetByIdValidationDto,
  DesignationsValidationDto,
  DesignationUpdateValidationDto,
} from "./dto/error/designation-validation.dto";
import {
  DesignationListSuccessDto,
  DesignationSuccessDto,
} from "./dto/success/designation-success.dto";

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
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(DesignationSuccessDto, 201)
  @ApiErrorResponses({
    validation: DesignationCreateValidationDto,
    unauthorized: DesignationCreateUnauthorizedDto,
    forbidden: DesignationCreateForbiddenDto,
    conflict: DesignationCreateConflictDto,
    internal: DesignationCreateInternalErrorDto,
  })
  @Roles("SUPER ADMIN")
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDesignationDto: CreateDesignationDto) {
    return await this.designationService.create(createDesignationDto);
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
    queryDto: SearchQueryDto,
  })
  @ApiSuccessResponse(DesignationListSuccessDto, 200)
  @ApiErrorResponses({
    validation: DesignationsValidationDto,
    internal: DesignationsInternalErrorDto,
  })
  @Get()
  async findAll(@Query() query: SearchQueryDto) {
    return await this.designationService.findAll(query);
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
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(DesignationSuccessDto, 200)
  @ApiErrorResponses({
    validation: DesignationGetByIdValidationDto,
    notFound: DesignationNotFoundDto,
    internal: DesignationInternalErrorDto,
  })
  @Get(":id")
  async findOne(@Param() params: MongoIdDto) {
    return await this.designationService.findOne(params.id);
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
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the designation to update",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(DesignationSuccessDto, 200)
  @ApiErrorResponses({
    validation: DesignationUpdateValidationDto,
    unauthorized: DesignationUpdateUnauthorizedDto,
    forbidden: DesignationUpdateForbiddenDto,
    notFound: DesignationUpdateByIdNotFoundDto,
    conflict: DesignationUpdateConflictDto,
    internal: DesignationUpdateInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles("SUPER ADMIN")
  @Patch(":id")
  async update(
    @Param() params: MongoIdDto,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return await this.designationService.update(
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
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the designation to delete",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(DesignationSuccessDto, 200)
  @ApiErrorResponses({
    validation: DesignationDeleteValidationDto,
    unauthorized: DesignationDeleteUnauthorizedDto,
    notFound: DesignationDeleteByIdNotFoundDto,
    internal: DesignationDeleteInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles("SUPER ADMIN")
  @Delete(":id")
  async remove(@Param() params: MongoIdDto) {
    return await this.designationService.remove(params.id);
  }
}
