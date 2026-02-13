import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { SearchQueryDto } from "../../../api-gateway/src/common/dto/search-query.dto";
import { Department, UserRole } from "../schemas/user.schema";

/**
 * Data Transfer Object for querying users with pagination, optional search key, and filters for role and department.
 * Extends the SearchQueryDto to include pagination and search key fields, and adds additional fields for filtering users based on their role and department.
 * Validates that the role field, if provided, is a valid UserRole enum value, and that the department field, if provided, is a valid Department enum value.
 * This DTO is used in endpoints that allow querying users with specific criteria, ensuring that the input data is valid and meets the necessary requirements before processing the request.
 * The validation rules defined in this DTO help maintain data integrity and ensure that queries for users are correctly formatted while allowing for flexible filtering based on user roles and departments.
 */
export class UserSearchQueryDto extends SearchQueryDto {
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsEnum(UserRole, {
    message:
      "Role must be a valid UserRole: DIRECTOR, HR, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE",
  })
  @IsOptional()
  role?: UserRole;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsEnum(Department, {
    message:
      "Department must be a valid Department: SHOPIFY, WORDPRESS, CUSTOM",
  })
  @IsOptional()
  department?: Department;
}
