/**
 * @fileoverview Update Task DTO
 *
 * Defines the validation schema for updating an existing task.
 * Extends CreateTaskDto with all fields made optional via PartialType,
 * and adds a required MongoDB ObjectId for identifying the task.
 */
import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../../schemas/task.schema";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class UpdateTaskStatusDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: `Invalid task status - ${Object.values(TaskStatus).join(", ")}`,
  })
  status?: TaskStatus;
}
