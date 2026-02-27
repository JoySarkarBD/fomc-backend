/** @fileoverview UserSearchQueryDto. Validation schema for user search query parameters in the API Gateway. @module user-service/dto/user-search-query.dto*/
import { ApiProperty } from "@nestjs/swagger";
import { SearchQueryDto } from "@shared/dto";
import { Transform } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsOptional,
  ValidateIf,
} from "class-validator";

/**
 * Data Transfer Object for validating user search query parameters in the API Gateway.
 * Contains fields for filtering users based on role, department, and designation.
 * Validates that the fields are optional and, if provided, must be valid MongoDB ObjectIds.
 * This DTO is used in the user service to handle search user requests and ensure that the provided query parameters meet the required format before processing the request to search for users in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid query parameters are accepted when searching for users through the API Gateway.
 */
export class UserSearchQueryDto extends SearchQueryDto {
  @ApiProperty({
    description: "Filter users by role IDs (comma-separated or array)",
    example: "60c72b2f9b1d8e5a5c8f9e7d,60c72b2f9b1d8e5a5c8f9e7e",
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    const values = Array.isArray(value) ? value : [value];
    const cleaned = values
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter((item) => item !== "");
    return cleaned.length ? cleaned : undefined;
  })
  @ValidateIf(
    (o) => o.role !== undefined && o.role !== null && o.role.length > 0,
  )
  @IsArray({ message: "Role must be an array of MongoDB ObjectIds" })
  @ArrayNotEmpty({ message: "Role array cannot be empty" })
  @IsMongoId({
    each: true,
    message: "Each role must be a valid MongoDB ObjectId",
  })
  role?: string[] | null;

  @ApiProperty({
    description: "Filter users by department IDs (comma-separated or array)",
    example: "60c72b2f9b1d8e5a5c8f9e7d,60c72b2f9b1d8e5a5c8f9e7e",
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    const values = Array.isArray(value) ? value : [value];
    const cleaned = values
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter((item) => item !== "");
    return cleaned.length ? cleaned : undefined;
  })
  @ValidateIf(
    (o) =>
      o.department !== undefined &&
      o.department !== null &&
      o.department.length > 0,
  )
  @IsArray({ message: "Department must be an array of MongoDB ObjectIds" })
  @ArrayNotEmpty({ message: "Department array cannot be empty" })
  @IsMongoId({
    each: true,
    message: "Each department must be a valid MongoDB ObjectId",
  })
  department?: string[] | null;

  @ApiProperty({
    description: "Filter users by designation IDs (comma-separated or array)",
    example: "60c72b2f9b1d8e5a5c8f9e7d,60c72b2f9b1d8e5a5c8f9e7e",
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    const values = Array.isArray(value) ? value : [value];
    const cleaned = values
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter((item) => item !== "");
    return cleaned.length ? cleaned : undefined;
  })
  @ValidateIf(
    (o) =>
      o.designation !== undefined &&
      o.designation !== null &&
      o.designation.length > 0,
  )
  @IsArray({ message: "Designation must be an array of MongoDB ObjectIds" })
  @ArrayNotEmpty({ message: "Designation array cannot be empty" })
  @IsMongoId({
    each: true,
    message: "Each designation must be a valid MongoDB ObjectId",
  })
  designation?: string[] | null;
}
