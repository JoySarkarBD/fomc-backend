/**
 * @fileoverview Department gateway controller.
 *
 * Exposes CRUD endpoints for department management and delegates
 * business logic to DepartmentService.
 *
 * @module api-gateway/department
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
import { CreateDepartmentDto } from "../../../workforce-service/src/department/dto/create-department.dto";
import { UpdateDepartmentDto } from "../../../workforce-service/src/department/dto/update-department.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiRequestDetails } from "../common/decorators/api-request.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { DepartmentService } from "./department.service";
import {
  DepartmentCreateConflictDto,
  DepartmentUpdateConflictDto,
} from "./dto/error/department-conflict.dto";
import {
  DepartmentDeleteForbiddenDto,
  DepartmentUpdateForbiddenDto,
} from "./dto/error/department-forbidden.dto";
import {
  DepartmentCreateInternalErrorDto,
  DepartmentDeleteInternalErrorDto,
  DepartmentInternalErrorDto,
  DepartmentUpdateInternalErrorDto,
} from "./dto/error/department-internal-error.dto";
import {
  DepartmentDeleteByIdNotFoundDto,
  DepartmentNotFoundDto,
  DepartmentUpdateByIdNotFoundDto,
} from "./dto/error/department-not-found.dto";
import {
  DepartmentCreateUnauthorizedDto,
  DepartmentDeleteUnauthorizedDto,
  DepartmentUpdateUnauthorizedDto,
} from "./dto/error/department-unauthorized.dto";
import {
  DepartmentCreateValidationDto,
  DepartmentDeleteValidationDto,
  DepartmentGetByIdValidationDto,
  DepartmentsValidationDto,
  DepartmentUpdateValidationDto,
} from "./dto/error/department-validation.dto";
import {
  DepartmentByIdSuccessDto,
  DepartmentCreateSuccessDto,
  DepartmentDeleteSuccessDto,
  DepartmentPatchSuccessDto,
  DepartmentsListSuccessDto,
} from "./dto/success/department-success.dto";

@ApiTags("Department")
@Controller("department")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Create a new department.
   *
   * @param {CreateDepartmentDto} data - The data transfer object containing the details of the department to be created.
   * @returns Promise resolving to the newly created department.
   */
  @ApiOperation({
    summary: "Create department",
    description: "Creates a new department in the organization.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(DepartmentCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: DepartmentCreateValidationDto,
    unauthorized: DepartmentCreateUnauthorizedDto,
    conflict: DepartmentCreateConflictDto,
    internal: DepartmentCreateInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentService.create(createDepartmentDto);
  }

  /**
   * Retrieve all departments based on the provided search query parameters.
   *
   * @param {SearchQueryDto} query - The search query parameters for filtering and pagination.
   * @return Promise resolving to a list of departments matching the search criteria.
   */
  @ApiOperation({
    summary: "List departments",
    description: "Retrieves a list of departments with optional filtering.",
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
        description:
          "Optional free-text search term to filter departments by name or description",
        required: false,
        type: String,
        default: "",
        example: "engineering",
      },
    ],
    queryDto: SearchQueryDto,
  })
  @ApiSuccessResponse(DepartmentsListSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentsValidationDto,
    internal: DepartmentInternalErrorDto,
  })
  @Get()
  async findAll(@Query() query: SearchQueryDto) {
    return await this.departmentService.findAll(query);
  }

  /**
   * Retrieve a single department by ID.
   *
   * @param {string} id - The ID of the department to be retrieved.
   * @return Promise resolving to the department details.
   */
  @ApiOperation({
    summary: "Get department by ID",
    description: "Retrieves details of a specific department.",
  })
  @ApiRequestDetails({
    params: {
      name: "id",
      description: "The ID of the department to retrieve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(DepartmentByIdSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentGetByIdValidationDto,
    notFound: DepartmentNotFoundDto,
    internal: DepartmentInternalErrorDto,
  })
  @Get(":id")
  async findOne(@Param() params: MongoIdDto) {
    return await this.departmentService.findOne(params.id);
  }

  /**
   * Update an existing department by ID.
   *
   * @param {string} id - The ID of the department to be updated.
   * @param {UpdateDepartmentDto} updateDepartmentDto - The data transfer object containing the updated details of the department.
   * @return Promise resolving to the updated department details.
   */
  @ApiOperation({
    summary: "Update department",
    description: "Updates an existing department's details.",
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
      description: "The ID of the department to retrieve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(DepartmentPatchSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentUpdateValidationDto,
    unauthorized: DepartmentUpdateUnauthorizedDto,
    forbidden: DepartmentUpdateForbiddenDto,
    notFound: DepartmentUpdateByIdNotFoundDto,
    conflict: DepartmentUpdateConflictDto,
    internal: DepartmentUpdateInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param() params: MongoIdDto,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return await this.departmentService.update(params.id, updateDepartmentDto);
  }

  /**
   * Delete a department by ID.
   *
   * @param {string} id - The ID of the department to be deleted.
   * @return Promise resolving to the result of the delete operation.
   */
  @ApiOperation({
    summary: "Delete department",
    description: "Deletes a department by its ID.",
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
      description: "The ID of the department to retrieve",
      required: true,
      type: String,
      example: "65f1b2c3d4e5f67890123456",
    },
    paramDto: MongoIdDto,
  })
  @ApiSuccessResponse(DepartmentDeleteSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentDeleteValidationDto,
    unauthorized: DepartmentDeleteUnauthorizedDto,
    forbidden: DepartmentDeleteForbiddenDto,
    notFound: DepartmentDeleteByIdNotFoundDto,
    internal: DepartmentDeleteInternalErrorDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param() params: MongoIdDto) {
    return await this.departmentService.remove(params.id);
  }
}
