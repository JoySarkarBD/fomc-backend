import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TASK_COMMANDS } from "@shared/constants/task-command.constants";
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { handleException } from "@shared/utils/handle.exception";
import { CreateTaskDto } from "apps/workforce-service/src/task-management/dto/create-task.dto";
import {
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from "apps/workforce-service/src/task-management/dto/update-task.dto";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";

/**
 * @fileoverview Task gateway service.
 *
 * Handles communication with the Workforce micro-service via TCP ClientProxy.
 */
@Injectable()
export class TaskService {
  constructor(
    @Inject("WORKFORCE_SERVICE") private readonly workforceClient: ClientProxy,
  ) {}

  /**
   * Create a new task.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.CREATE_TASK }
   *
   * @param {AuthUser} user - The authenticated user creating the task.
   * @param {CreateTaskDto} createTaskDto - The details of the task being created.
   * @returns {Promise<any>} The created task details.
   */
  async create(user: AuthUser, createTaskDto: CreateTaskDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.CREATE_TASK, {
        user,
        createTaskDto,
      }),
    );
    handleException(result);

    return buildResponse("Designation created successfully", result);
  }

  /**
   * Get all tasks.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.GET_TASKS }
   *
   * @param {AuthUser} user - The authenticated user requesting the tasks.
   * @param {SearchQueryDto} query - The search query parameters for filtering tasks.
   * @returns {Promise<any>} A list of all tasks matching the search criteria.
   */
  async findAll(user: AuthUser, query: SearchQueryDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.GET_TASKS, {
        user,
        query,
      }),
    );
    return buildResponse("Designations retrieved successfully", result);
  }

  /**
   * Get a task by ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.GET_TASK }
   *
   * @param {AuthUser} user - The authenticated user requesting the task.
   * @param {MongoIdDto["id"]} id - The ID of the task to retrieve.
   * @returns {Promise<any>} The details of the task with the specified ID.
   */
  async findOne(user: AuthUser, id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.GET_TASK, {
        user,
        id,
      }),
    );

    handleException(result);
    return buildResponse("Task retrieved successfully", result);
  }

  /**
   * Update a task by ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.UPDATE_TASK }
   *
   * @param {AuthUser} user - The authenticated user updating the task.
   * @param {MongoIdDto["id"]} id - The ID of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The updated details of the task.
   * @returns {Promise<any>} The updated task details.
   */
  async update(
    user: AuthUser,
    id: MongoIdDto["id"],
    updateTaskDto: UpdateTaskDto,
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.UPDATE_TASK, {
        user,
        id,
        updateTaskDto,
      }),
    );
    handleException(result);
    return buildResponse("Task updated successfully", result);
  }

  /**
   * Update a task's status by ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.UPDATE_TASK_STATUS }
   *
   * @param {AuthUser} user - The authenticated user updating the task status.
   * @param {MongoIdDto["id"]} id - The ID of the task to update.
   * @param {UpdateTaskStatusDto} updateTaskStatusDto - The updated status of the task.
   * @returns {Promise<any>} The updated task details with the new status.
   */
  async updateStatus(
    user: AuthUser,
    id: MongoIdDto["id"],
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.UPDATE_TASK_STATUS, {
        user,
        id,
        updateTaskStatusDto,
      }),
    );
    handleException(result);
    return buildResponse("Task status updated successfully", result);
  }

  /**
   * Delete a task by ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.DELETE_TASK }
   *
   * @param {AuthUser} user - The authenticated user deleting the task.
   * @param {MongoIdDto["id"]} id - The ID of the task to delete.
   * @returns {Promise<any>} A message indicating the result of the delete operation.
   */
  async delete(user: AuthUser, id: MongoIdDto["id"]) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.DELETE_TASK, {
        user,
        id,
      }),
    );
    handleException(result);
    return buildResponse("Task deleted successfully", result);
  }
}
