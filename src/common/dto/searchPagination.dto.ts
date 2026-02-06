import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * DTO for handling search and pagination query parameters.
 * Validates and transforms query parameters for paginated search endpoints.
 */
export class searchPaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
