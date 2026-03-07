/**
 * @fileoverview Task Controller
 *
 * Handles all task-related microservice message patterns in the
 * Workforce service. Supports CRUD operations on tasks via TCP transport.
 */
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TASK_COMMANDS } from "@shared/constants/task-command.constants";
import { MongoIdDto, SearchQueryDto } from "@shared/dto";
import type { AuthUser } from "@shared/interfaces";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto, UpdateTaskStatusDto } from "./dto/update-task.dto";
import { TaskService } from "./task.service";

/**
 * Task Controller
 *
 * Handles all task-related microservice message patterns.
 * Communicates through message-based transport (e.g., TCP, RMQ, Kafka).
 */
@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Create a new task.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.CREATE_TASK }
   *
   * @param {Object} payload - The payload containing the task details.
   * @param {AuthUser} payload.user - The authenticated user creating the task.
   * @param {CreateTaskDto} payload.createTaskDto - The details of the task being created.
   */
  @MessagePattern(TASK_COMMANDS.CREATE_TASK)
  async create(
    @Payload() payload: { user: AuthUser; createTaskDto: CreateTaskDto },
  ): Promise<any> {
    return await this.taskService.create(payload.user, payload.createTaskDto);
  }

  /**
   * Retrieve all tasks.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.GET_TASKS }
   *
   * @param {Object} payload - The payload containing the search query parameters.
   * @param {AuthUser} payload.user - The authenticated user requesting the tasks.
   * @param {SearchQueryDto} payload.query - The search query parameters for filtering tasks.
   * @return {Promise<any>} A list of all tasks.
   */
  @MessagePattern(TASK_COMMANDS.GET_TASKS)
  async findAll(
    @Payload() payload: { user: AuthUser; query: SearchQueryDto },
  ): Promise<any> {
    return await this.taskService.findAll(payload.user, payload.query);
  }

  /**
   * Retrieve a specific task by its ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.GET_TASK }
   *
   * @param {Object} payload - The payload containing the task ID.
   * @param {AuthUser} payload.user - The authenticated user requesting the task.
   * @param {MongoIdDto["id"]} payload.id - The ID of the task to retrieve.
   * @return {Promise<any>} The details of the task with the specified ID.
   */
  @MessagePattern(TASK_COMMANDS.GET_TASK)
  async findOne(
    @Payload() payload: { user: AuthUser; id: MongoIdDto["id"] },
  ): Promise<any> {
    return await this.taskService.findOne(payload.user, payload.id);
  }

  /**
   * Update a specific task by its ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.UPDATE_TASK }
   *
   * @param {Object} payload - The payload containing the task ID and the updated task details.
   * @param {AuthUser} payload.user - The authenticated user updating the task.
   * @param {MongoIdDto["id"]} payload.id - The ID of the task to update.
   * @param {UpdateTaskDto} payload.updateTaskDto - The updated details of the task.
   * @return {Promise<any>} The updated task document.
   */
  @MessagePattern(TASK_COMMANDS.UPDATE_TASK)
  async update(
    @Payload()
    payload: {
      user: AuthUser;
      id: MongoIdDto["id"];
      updateTaskDto: UpdateTaskDto;
    },
  ): Promise<any> {
    return await this.taskService.update(
      payload.user,
      payload.id,
      payload.updateTaskDto,
    );
  }

  /**
   * Update the status of a specific task by its ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.UPDATE_TASK_STATUS }
   *
   * @param {Object} payload - The payload containing the task ID and the updated task status.
   * @param {AuthUser} payload.user - The authenticated user updating the task status.
   * @param {MongoIdDto["id"]} payload.id - The ID of the task to update.
   * @param {UpdateTaskStatusDto} payload.updateTaskDto - The updated details of the task.
   * @return {Promise<any>} The updated task document.
   */
  @MessagePattern(TASK_COMMANDS.UPDATE_TASK_STATUS)
  async updateTaskStatus(
    @Payload()
    payload: {
      user: AuthUser;
      id: MongoIdDto["id"];
      updateTaskStatusDto: UpdateTaskStatusDto;
    },
  ): Promise<any> {
    return await this.taskService.updateTaskStatus(
      payload.user,
      payload.id,
      payload.updateTaskStatusDto,
    );
  }

  /**
   * Delete a specific task by its ID.
   *
   * Message Pattern: { cmd: TASK_COMMANDS.DELETE_TASK }
   *
   * @param {Object} payload - The payload containing the task ID.
   * @param {AuthUser} payload.user - The authenticated user deleting the task.
   * @param {MongoIdDto["id"]} payload.id - The ID of the task to delete.
   * @return {Promise<any>} The deleted task document.
   */
  @MessagePattern(TASK_COMMANDS.DELETE_TASK)
  async remove(
    @Payload() payload: { user: AuthUser; id: MongoIdDto["id"] },
  ): Promise<any> {
    return await this.taskService.remove(payload.user, payload.id);
  }
}
