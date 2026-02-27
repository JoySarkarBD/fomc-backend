/**
 * @fileoverview Create Designation DTO
 *
 * Defines the validation schema for creating a new designation.
 * Ensures name and description are provided as non-empty strings.
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * Data Transfer Object for creating a new designation in the workforce service.
 * Contains fields for designation name and description, with validation rules to ensure that both fields are required and must be strings.
 * The CreateDesignationDto is used in the designation service to handle create designation requests and ensure that the provided data meets the required format before processing the request to create a new designation in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid designation information is accepted when creating new designations through the workforce service.
 */
export class CreateDesignationDto {
  @ApiProperty({
    required: true,
    description: "The name of the designation",
    example: "Software Engineer",
  })
  @IsString({ message: "Designation name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @ApiProperty({
    description: "A brief description of the designation",
    example:
      "Responsible for developing and maintaining software applications.",
  })
  @IsOptional()
  @IsString({ message: "Designation description must be a string" })
  description?: string;

  @ApiProperty({
    required: true,
    description: "The ID of the department this designation belongs to",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Department ID must be a valid MongoDB ObjectId" })
  @IsNotEmpty({ message: "Department ID is required" })
  departmentId!: string;
}
