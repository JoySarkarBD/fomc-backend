/**
 * @fileoverview Get Leave DTO
 *
 * Defines the validation schema for retrieving leave records.
 * Allows optional month and year parameters to filter leave data.
 */
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

/**
 * Data Transfer Object for retrieving leave records in the workforce service.
 * Contains an optional field for year, with validation rules to ensure that if provided, year must be a valid integer (e.g., between 1900 and 2999).
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid query parameters are accepted when retrieving leave records through the workforce service.
 */
export class GetLeaveDto {
  @ApiProperty({
    required: true,
    description: "The year for which to retrieve leave records",
    example: 2024,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsInt({ message: "Year must be an integer" })
  @Min(1900, { message: "Year must be valid" })
  @Max(2999, { message: "Year must be valid" })
  year!: number;
}
