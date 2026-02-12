import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import {
  Department,
  UserRole,
} from "../../../../user-service/src/schemas/user.schema";

/**
 * Data Transfer Object for updating an existing user's information in the API Gateway.
 * Contains fields for user information such as name, employee ID, phone number, email, secondary email, password, role, and department.
 * All fields are optional to allow for partial updates, but each field has its own validation rules to ensure that any provided data meets the required format before processing the update request.
 * The UpdateUserDto is used in the user service to handle update user requests and ensure that the provided data is valid before sending the update request to the User Service for processing.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user information is accepted when updating existing users through the API Gateway.
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

export class UpdateUserMessageDto extends UpdateUserDto {
  @IsMongoId({ message: "ID must be a valid Mongo ID" })
  id!: string;
}
