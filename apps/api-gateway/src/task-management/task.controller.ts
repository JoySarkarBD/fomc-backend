/**
 * @fileoverview Task gateway controller.
 *
 * Exposes task-related HTTP endpoints.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
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
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { CreateTaskDto } from "apps/workforce-service/src/task-management/dto/create-task.dto";
import {
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from "apps/workforce-service/src/task-management/dto/update-task.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  TaskByIdForbiddenDto,
  TaskCreateForbiddenDto,
  TaskDeleteForbiddenDto,
  TaskListForbiddenDto,
  TaskStatusUpdateForbiddenDto,
  TaskUpdateForbiddenDto,
} from "./dto/error/task-forbidden.dto";
import {
  TaskByIdInternalErrorDto,
  TaskCreateInternalErrorDto,
  TaskDeleteInternalErrorDto,
  TaskListInternalErrorDto,
  TaskStatusUpdateInternalErrorDto,
  TaskUpdateInternalErrorDto,
} from "./dto/error/task-internal-error.dto";
import {
  TaskByIdNotFoundDto,
  TaskDeleteNotFoundDto,
  TaskStatusUpdateNotFoundDto,
  TaskUpdateNotFoundDto,
} from "./dto/error/task-not-found.dto";
import {
  TaskByIdUnauthorizedDto,
  TaskCreateUnauthorizedDto,
  TaskDeleteUnauthorizedDto,
  TaskListUnauthorizedDto,
  TaskStatusUpdateUnauthorizedDto,
  TaskUpdateUnauthorizedDto,
} from "./dto/error/task-unauthorized.dto";
import {
  TaskByIdValidationDto,
  TaskCreateValidationDto,
  TaskDeleteValidationDto,
  TaskListValidationDto,
  TaskStatusUpdateValidationDto,
  TaskUpdateValidationDto,
} from "./dto/error/task-validation.dto";
import {
  TaskByIdSuccessDto,
  TaskCreateSuccessDto,
  TaskDeleteSuccessDto,
  TaskListSuccessDto,
  TaskStatusUpdateFoundDto,
  TaskUpdateSuccessDto,
} from "./dto/success/project-success.dto";
import { TaskService } from "./task.service";

@ApiTags("Task Management")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Create a new task.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.CREATE_TASK }
   *
   * @param {CreateTaskDto} createTaskDto - The details of the task being created.
   * @returns {Promise<any>} The created task details.
   */
  @ApiOperation({
    summary: "Create a new task",
    description:
      "Creates a new task in the system. Requires authentication and appropriate permissions.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(TaskCreateSuccessDto, 201)
  @ApiErrorResponses({
    validation: TaskCreateValidationDto,
    unauthorized: TaskCreateUnauthorizedDto,
    forbidden: TaskCreateForbiddenDto,
    internal: TaskCreateInternalErrorDto,
  })
  @Roles("SALES")
  @Post()
  async create(
    @GetUser() user: AuthUser,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return await this.taskService.create(user, createTaskDto);
  }

  @ApiOperation({
    summary: "Get all tasks",
    description:
      "Retrieves a list of all tasks. Requires authentication and appropriate permissions.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(TaskListSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: TaskListUnauthorizedDto,
    validation: TaskListValidationDto,
    forbidden: TaskListForbiddenDto,
    internal: TaskListInternalErrorDto,
  })
  @Roles("SALES", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Get()
  async findAll(@GetUser() user: AuthUser, @Query() query: SearchQueryDto) {
    return await this.taskService.findAll(user, query);
  }

  @ApiOperation({
    summary: "Get a task by ID",
    description:
      "Retrieves a specific task by its ID. Requires authentication and appropriate permissions.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(TaskByIdSuccessDto, 200)
  @ApiErrorResponses({
    notFound: TaskByIdNotFoundDto,
    validation: TaskByIdValidationDto,
    unauthorized: TaskByIdUnauthorizedDto,
    forbidden: TaskByIdForbiddenDto,
    internal: TaskByIdInternalErrorDto,
  })
  @Roles("SALES", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Get(":id")
  async findOne(@GetUser() user: AuthUser, @Query() param: MongoIdDto) {
    return await this.taskService.findOne(user, param.id);
  }

  @ApiOperation({
    summary: "Update a task by ID",
    description:
      "Updates a specific task by its ID. Requires authentication and appropriate permissions.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(TaskUpdateSuccessDto, 200)
  @ApiErrorResponses({
    notFound: TaskUpdateNotFoundDto,
    validation: TaskUpdateValidationDto,
    unauthorized: TaskUpdateUnauthorizedDto,
    forbidden: TaskUpdateForbiddenDto,
    internal: TaskUpdateInternalErrorDto,
  })
  @Roles("SALES", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Patch(":id")
  async update(
    @GetUser() user: AuthUser,
    @Query() param: MongoIdDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.taskService.update(user, param.id, updateTaskDto);
  }

  @ApiOperation({
    summary: "Update a task's status by ID",
    description:
      "Updates the status of a specific task by its ID. Requires authentication and appropriate permissions.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(TaskStatusUpdateFoundDto, 200)
  @ApiErrorResponses({
    notFound: TaskStatusUpdateNotFoundDto,
    validation: TaskStatusUpdateValidationDto,
    unauthorized: TaskStatusUpdateUnauthorizedDto,
    forbidden: TaskStatusUpdateForbiddenDto,
    internal: TaskStatusUpdateInternalErrorDto,
  })
  @Roles("SALES", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Patch(":id/status")
  async updateTaskStatus(
    @GetUser() user: AuthUser,
    @Query() param: MongoIdDto,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return await this.taskService.updateStatus(
      user,
      param.id,
      updateTaskStatusDto,
    );
  }

  @ApiOperation({
    summary: "Delete a task by ID",
    description:
      "Deletes a specific task by its ID. Requires authentication and appropriate permissions.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(TaskDeleteSuccessDto, 200)
  @ApiErrorResponses({
    notFound: TaskDeleteNotFoundDto,
    validation: TaskDeleteValidationDto,
    unauthorized: TaskDeleteUnauthorizedDto,
    forbidden: TaskDeleteForbiddenDto,
    internal: TaskDeleteInternalErrorDto,
  })
  @Roles("SALES", "PROJECT MANAGER", "TEAM LEADER", "EMPLOYEE")
  @Delete(":id")
  async delete(@GetUser() user: AuthUser, @Query() param: MongoIdDto) {
    return await this.taskService.delete(user, param.id);
  }
}
