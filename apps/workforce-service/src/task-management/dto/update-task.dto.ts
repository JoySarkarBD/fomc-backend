/**
 * @fileoverview Update Task DTO
 *
 * Defines the validation schema for updating an existing task.
 * Extends CreateTaskDto with all fields made optional via PartialType,
 * and adds a required MongoDB ObjectId for identifying the task.
 */
import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsMongoId({ message: "ID must be a valid Mongo ID" })
  id!: string;
}
