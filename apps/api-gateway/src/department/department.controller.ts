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
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { MongoIdDto } from "@shared/dto/mongo-id.dto";
import { SearchQueryDto } from "@shared/dto/search-query.dto";
import { CreateDepartmentDto } from "../../../workforce-service/src/department/dto/create-department.dto";
import { UpdateDepartmentDto } from "../../../workforce-service/src/department/dto/update-department.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { DepartmentService } from "./department.service";
import {
  DepartmentCreateConflictDto,
  DepartmentUpdateConflictDto,
} from "./dto/error/department-conflict.dto";
import {
  DepartmentDeleteForbiddenDto,
  DepartmentGetByIdForbiddenDto,
  DepartmentsForbiddenDto,
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
  DepartmentGetByIdUnauthorizedDto,
  DepartmentsUnauthorizedDto,
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
@UseGuards(JwtAuthGuard)
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
  @ApiSuccessResponse(DepartmentCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: DepartmentCreateValidationDto,
    unauthorized: DepartmentCreateUnauthorizedDto,
    conflict: DepartmentCreateConflictDto,
    internal: DepartmentCreateInternalErrorDto,
  })
  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentService.createDepartment(createDepartmentDto);
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
  @ApiSuccessResponse(DepartmentsListSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentsValidationDto,
    unauthorized: DepartmentsUnauthorizedDto,
    forbidden: DepartmentsForbiddenDto,
    internal: DepartmentInternalErrorDto,
  })
  @Get()
  async findDepartments(@Query() query: SearchQueryDto) {
    return await this.departmentService.findDepartments(query);
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
  @ApiParam({
    name: "id",
    type: String,
    required: true,
    example: "65f1b2c3d4e5f67890123456",
  })
  @ApiSuccessResponse(DepartmentByIdSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentGetByIdValidationDto,
    unauthorized: DepartmentGetByIdUnauthorizedDto,
    forbidden: DepartmentGetByIdForbiddenDto,
    notFound: DepartmentNotFoundDto,
    internal: DepartmentInternalErrorDto,
  })
  @Get(":id")
  async findDepartmentById(@Param() params: MongoIdDto) {
    return await this.departmentService.findDepartmentById(params.id);
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
  @ApiParam({
    name: "id",
    type: String,
    required: true,
    example: "65f1b2c3d4e5f67890123456",
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
  @Patch(":id")
  async updateDepartmentById(
    @Param() params: MongoIdDto,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return await this.departmentService.updateDepartmentById(
      params.id,
      updateDepartmentDto,
    );
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
  @ApiParam({
    name: "id",
    type: String,
    required: true,
    example: "65f1b2c3d4e5f67890123456",
  })
  @ApiSuccessResponse(DepartmentDeleteSuccessDto, 200)
  @ApiErrorResponses({
    validation: DepartmentDeleteValidationDto,
    unauthorized: DepartmentDeleteUnauthorizedDto,
    forbidden: DepartmentDeleteForbiddenDto,
    notFound: DepartmentDeleteByIdNotFoundDto,
    internal: DepartmentDeleteInternalErrorDto,
  })
  @Delete(":id")
  async deleteDepartmentById(@Param() params: MongoIdDto) {
    return await this.departmentService.deleteDepartmentById(params.id);
  }
}
