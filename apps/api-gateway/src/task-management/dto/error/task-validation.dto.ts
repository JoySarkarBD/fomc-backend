import { ApiProperty } from "@nestjs/swagger";
import {
  FieldErrorDto,
  ValidationErrorResponseDto,
} from "apps/api-gateway/src/common/dto/validation-error.dto";
import { Methods } from "apps/api-gateway/src/common/enum/methods.enum";
import { TaskStatus } from "apps/workforce-service/src/schemas/task.schema";

export class TaskCreateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.POST })
  declare method: Methods.POST;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "name", message: "Name must be a string" },
      { field: "client", message: "Client must be a valid MongoDB ObjectId" },
      {
        field: "project",
        message: "Project must be a valid MongoDB ObjectId",
      },
      { field: "dueDate", message: "dueDate must be a valid ISO date string" },
      {
        field: "priority",
        message: `priority must be a valid enum ${Object.values(TaskStatus).join(", ")}`,
      },
      {
        field: "description",
        message: "Description must be a string",
      },
      {
        field: "status",
        message: `status must be a valid enum ${Object.values(TaskStatus).join(", ")}`,
      },
      {
        field: "assignTo",
        message: "assignTo must be an array of valid MongoDB ObjectIds",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class TaskListValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "pageNo", message: "pageNo must be a positive integer" },
      { field: "pageSize", message: "pageSize must be a positive integer" },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class TaskByIdValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.GET })
  declare method: Methods.GET;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "id", message: "id must be a valid ObjectId" }],
  })
  declare errors: FieldErrorDto[];
}

export class TaskDeleteValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.DELETE })
  declare method: Methods.DELETE;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [{ field: "id", message: "id must be a valid ObjectId" }],
  })
  declare errors: FieldErrorDto[];
}

export class TaskUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "id", message: "id must be a valid ObjectId" },
      { field: "name", message: "Name must be a string" },
      {
        field: "client",
        message: "Client must be a valid MongoDB ObjectId",
      },
      {
        field: "project",
        message: "Project must be a valid MongoDB ObjectId",
      },
      { field: "dueDate", message: "dueDate must be a valid ISO date string" },
      {
        field: "priority",
        message: `priority must be a valid enum ${Object.values(TaskStatus).join(", ")}`,
      },
      {
        field: "description",
        message: "Description must be a string",
      },
      {
        field: "status",
        message: `status must be a valid enum ${Object.values(TaskStatus).join(", ")}`,
      },
      {
        field: "assignTo",
        message: "assignTo must be an array of valid MongoDB ObjectIds",
      },
    ],
  })
  declare errors: FieldErrorDto[];
}

export class TaskStatusUpdateValidationDto extends ValidationErrorResponseDto {
  @ApiProperty({ example: Methods.PATCH })
  declare method: Methods.PATCH;

  @ApiProperty({ example: "api/task/:id/status" })
  declare endpoint: string;

  @ApiProperty({
    type: [FieldErrorDto],
    example: [
      { field: "id", message: "id must be a valid ObjectId" },
      {
        field: "status",
        message: `status must be a valid enum ${Object.values(TaskStatus).join(", ")}`,
      },
    ],
  })
  declare errors: FieldErrorDto[];
}
