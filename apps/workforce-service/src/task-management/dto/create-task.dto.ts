/**
 * @fileoverview Create Task DTO
 *
 * Defines the validation schema for creating a new task. Includes custom
 * validators for fields that accept either a MongoDB ObjectId or plain string
 * (e.g., client, project). Validates required fields, enums, date formats,
 * and array contents.
 */
import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { TaskPriority, TaskStatus } from "../../schemas/task.schema";

/**
 * Data Transfer Object for creating a new task.
 * Contains fields for task name, client, project, due date, priority, description, status, creator ID, assignees, and attachments.
 * Validates that the name, client, project, due date, and createdBy fields are required and meet specific criteria (e.g., string type, valid MongoDB ObjectId).
 * Optional fields include priority (must be a valid TaskPriority enum value), description (string), status (must be a valid TaskStatus enum value), assignTo (array of valid MongoDB ObjectIds), and attachments (array of strings).
 * This DTO is used in the task creation process to ensure that the input data is valid and meets the necessary requirements before a new task is created in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that tasks are created with the necessary information while allowing for flexibility in how clients and projects are referenced.
 */
export class CreateTaskDto {
  @ApiProperty({
    required: true,
    description: "The name of the task",
    example: "Complete project documentation",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @ApiProperty({
    required: true,
    description: "The client associated with the task",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Client must be a valid ID" })
  @IsNotEmpty({ message: "Client is required" })
  client!: string;

  @ApiProperty({
    required: true,
    description: "The project associated with the task",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Project must be a valid ID" })
  @IsNotEmpty({ message: "Project is required" })
  project!: string;

  @ApiProperty({
    required: true,
    description: "The due date for the task (ISO date string)",
    example: "2024-06-30T23:59:59.000Z",
  })
  @IsDateString({}, { message: "dueDate must be a valid ISO date string" })
  @IsNotEmpty({ message: "dueDate is required" })
  dueDate!: Date;

  @ApiProperty({
    description: `The priority level of the task - ${Object.values(TaskPriority).join(", ")}`,
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  @IsEnum(TaskPriority, {
    message: `Invalid priority level - ${Object.values(TaskPriority).join(", ")}`,
  })
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: "A brief description of the task",
    example:
      "This task involves creating comprehensive documentation for the project.",
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: `The current status of the task - ${Object.values(TaskStatus).join(", ")}`,
    enum: TaskStatus,
    example: TaskStatus.WIP,
  })
  @IsEnum(TaskStatus, {
    message: `Invalid status - ${Object.values(TaskStatus).join(", ")}`,
  })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: "List of user IDs to assign the task to",
    example: ["60c72b2f9b1d8e5a5c8f9e7d", "60c72b2f9b1d8e5a5c8f9e7e"],
  })
  @IsArray({ message: "assignTo must be an array" })
  @IsMongoId({ each: true, message: "Each assignee must be a valid ObjectId" })
  @IsOptional()
  assignTo?: string[];
}
