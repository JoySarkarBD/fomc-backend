import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * Data Transfer Object for search queries with pagination and optional search key.
 * Contains fields for page number, page size, and an optional search key.
 * Validates that pageNo and pageSize are valid numbers (not NaN or Infinity) and that searchKey is a string if provided.
 * This DTO is used in various endpoints that support pagination and searching to ensure that the input data is valid and meets the necessary requirements before processing the request.
 * The validation rules defined in this DTO help maintain data integrity and ensure that pagination parameters are correctly formatted while allowing for an optional search key to filter results.
 */
export class SearchQueryDto {
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "pageNo must be a valid number" },
  )
  @Min(1, { message: "pageNo must be at least 1" })
  pageNo!: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "pageSize must be a valid number" },
  )
  @Min(1, { message: "pageSize must be at least 1" })
  @Max(100, { message: "pageSize cannot exceed 100" })
  pageSize!: number;

  @IsString({ message: "searchKey must be a string" })
  @IsOptional()
  searchKey?: string;
}
