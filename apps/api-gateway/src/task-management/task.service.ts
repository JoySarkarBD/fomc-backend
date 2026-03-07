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

  async findAll(user: AuthUser, query: SearchQueryDto) {
    const result = await firstValueFrom(
      this.workforceClient.send(TASK_COMMANDS.GET_TASKS, {
        user,
        query,
      }),
    );
    return buildResponse("Designations retrieved successfully", result);
  }

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
