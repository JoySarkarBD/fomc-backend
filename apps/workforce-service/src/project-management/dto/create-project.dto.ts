/**
 * @fileoverview Create Project DTO
 *
 * Defines the validation schema for creating a new project.
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
import { ProjectStatus } from "../../schemas/project.schema";

/**
 * Data Transfer Object for creating a new project.
 */
export class CreateProjectDto {
  @ApiProperty({
    required: true,
    description: "The name of the project",
    example: "Order Tracking System",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @ApiProperty({
    required: false,
    description: "The ID of the client associated with the project",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "client must be a valid ObjectId" })
  @IsOptional()
  client?: string;

  @ApiProperty({
    required: true,
    description: "External order identifier associated with the project",
    example: "ORD-123456",
  })
  @IsString({ message: "orderId must be a string" })
  @IsNotEmpty({ message: "orderId is required" })
  orderId!: string;

  @ApiProperty({
    required: false,
    description: "The ID of the profile associated with the project",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "profile must be a valid ObjectId" })
  @IsOptional()
  profile?: string;

  @ApiProperty({
    required: false,
    description: "The ID of the sales member associated with the project",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "salesMember must be a valid ObjectId" })
  @IsOptional()
  salesMember?: string;

  @ApiProperty({
    required: false,
    description: "The ID of the department currently assigned to the project",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "assignedDepartment must be a valid ObjectId" })
  @IsOptional()
  assignedDepartment?: string;

  @ApiProperty({
    description: "List of project file URLs or storage paths",
    example: ["https://example.com/file1.pdf", "https://example.com/file2.jpg"],
  })
  @IsArray({ message: "projectFiles must be an array" })
  @IsString({ each: true, message: "Each file path must be a string" })
  @IsOptional()
  projectFiles?: string[];

  @ApiProperty({
    description: "Internal remarks or notes about the project",
    example: "Urgent project, needs to be completed by the deadline.",
  })
  @IsString({ message: "projectRemarks must be a string" })
  @IsOptional()
  projectRemarks?: string;

  @ApiProperty({
    required: false,
    description: "The due date for the project (ISO date string)",
    example: "2024-06-30T23:59:59.000Z",
  })
  @IsDateString({}, { message: "dueDate must be a valid ISO date string" })
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    description: `The current status of the project - ${Object.values(ProjectStatus).join(", ")}`,
    enum: ProjectStatus,
    example: ProjectStatus.WIP,
  })
  @IsEnum(ProjectStatus, {
    message: `Invalid status - ${Object.values(ProjectStatus).join(", ")}`,
  })
  @IsOptional()
  status?: ProjectStatus;
}
