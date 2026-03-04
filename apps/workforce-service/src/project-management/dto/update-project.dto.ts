/**
 * @fileoverview Update Project DTO
 *
 * Defines the validation schema for updating an existing project.
 */
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { CreateProjectDto } from "./create-project.dto";

/**
 * Data Transfer Object for updating an existing project.
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({
    description: "Actual delivery date of the project (ISO date string)",
    example: "2024-06-30T23:59:59.000Z",
  })
  @IsDateString({}, { message: "deliveryDate must be a valid ISO date string" })
  @IsOptional()
  deliveryDate?: Date;
}
