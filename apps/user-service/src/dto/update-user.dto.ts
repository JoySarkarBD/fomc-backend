import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Department, UserRole } from "../schemas/user.schema";

/**
 * Data Transfer Object for updating user information in the API Gateway.
 * Contains fields for user information such as name, employee ID, phone number, email, secondary email, password, role, and department.
 * Validates that the fields are optional and meet specific validation criteria if provided, ensuring that any updates to user information are valid and correctly formatted before processing the request to update a user in the system.
 * The UpdateUserDto is used in the user service to handle update user requests and ensure that the provided data meets the required format before processing the request to update an existing user in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user information is accepted when updating users through the API Gateway.
 */
export class UpdateUserDto {
  @IsString({ message: "Name must be a string" })
  @IsOptional()
  name?: string;

  @IsString({ message: "Employee ID must be a string" })
  @IsOptional()
  employeeId?: string;

  @IsString({ message: "Phone number must be a string" })
  @IsOptional()
  phoneNumber?: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsOptional()
  email?: string;

  @IsEmail({}, { message: "Secondary email must be a valid email address" })
  @IsOptional()
  secondaryEmail?: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsOptional()
  password?: string;

  @IsEnum(UserRole, { message: "Role must be a valid UserRole" })
  @IsOptional()
  role?: UserRole;

  @IsEnum(Department, { message: "Department must be a valid Department" })
  @IsOptional()
  department?: Department;
}

/**
 * Data Transfer Object for updating user information with an ID in the API Gateway.
 * Extends the UpdateUserDto to include an additional field for the user ID, which is required for identifying the specific user to be updated.
 * Validates that the ID is a valid MongoDB ObjectId string, ensuring that any provided ID meets the required format before processing requests that involve updating a specific user in the system.
 * The UpdateUserMessageDto is used in the user service to handle update user requests that include a user ID and ensure that the provided data meets the required format before processing the request to update an existing user in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user information is accepted when updating users through the API Gateway, while also ensuring that the provided user ID is valid for identifying the user to be updated.
 */
export class UpdateUserMessageDto extends UpdateUserDto {
  @IsMongoId({ message: "ID must be a valid Mongo ID" })
  id!: string;
}
