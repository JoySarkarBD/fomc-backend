import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import {
  Department,
  UserRole,
} from "../../../../user-service/src/schemas/user.schema";

/**
 * Data Transfer Object for creating a new user in the API Gateway.
 * Contains fields for user information such as name, employee ID, phone number, email, secondary email, password, role, and department.
 * Validates that the name, phone number, email, and password fields are required and meet specific validation criteria, while employee ID, secondary email, role, and department are optional fields with their own validation rules.
 * The CreateUserDto is used in the user service to handle create user requests and ensure that the provided data meets the required format before processing the request to create a new user in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user information is accepted when creating new users through the API Gateway.
 */
export class CreateUserDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsString({ message: "Employee ID must be a string" })
  @IsOptional()
  employeeId?: string;

  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  phoneNumber!: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @IsEmail({}, { message: "Secondary email must be a valid email address" })
  @IsOptional()
  secondaryEmail?: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;

  @IsEnum(UserRole, { message: "Role must be a valid UserRole" })
  @IsOptional()
  role?: UserRole;

  @IsEnum(Department, { message: "Department must be a valid Department" })
  @IsOptional()
  department?: Department;
}
