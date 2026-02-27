/**
 * @fileoverview Create Department DTO
 *
 * Defines the validation schema for creating a new department.
 * Ensures name and description are provided as non-empty strings.
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * Data Transfer Object for creating a new department in the workforce service.
 * Contains fields for department name and description, with validation rules to ensure that both fields are required and must be strings.
 * The CreateDepartmentDto is used in the department service to handle create department requests and ensure that the provided data meets the required format before processing the request to create a new department in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid department information is accepted when creating new departments through the workforce service.
 */
export class CreateDepartmentDto {
  @ApiProperty({
    required: true,
    description: "The name of the department",
    example: "Human Resources",
  })
  @IsString({ message: "Department name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @ApiProperty({
    required: true,
    description: "A brief description of the department",
    example: "Handles employee relations, recruitment, and benefits.",
  })
  @IsOptional()
  @IsString({ message: "Department description must be a string" })
  description?: string;
}
