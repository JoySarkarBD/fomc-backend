/** @fileoverview CreateUserDto. Validation schema for user creation payloads. @module user-service/dto/create-user.dto */
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

/**
 * Data Transfer Object for creating a new user in the user service.
 * Contains fields for user information such as name, employee ID, phone number, email, secondary email, password, role, and department.
 * Validates that the name, phone number, email, and password fields are required and meet specific validation criteria, while employee ID, secondary email, role, and department are optional fields with their own validation rules.
 * The CreateUserDto is used in the user service to handle create user requests and ensure that the provided data meets the required format before processing the request to create a new user in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user information is accepted when creating new users through the API Gateway.
 */
export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: "The full name of the user",
    example: "John Doe",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @ApiProperty({
    description: "The employee ID of the user",
    example: "EMP12345",
  })
  @IsString({ message: "Employee ID must be a string" })
  employeeId!: string;

  @ApiProperty({
    required: true,
    description: "The user's phone number",
    example: "+1234567890",
  })
  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  phoneNumber!: string;

  @ApiProperty({
    required: true,
    description: "The user's email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @ApiProperty({
    description: "The user's secondary email address",
    example: "secondary@example.com",
  })
  @IsEmail({}, { message: "Secondary email must be a valid email address" })
  @IsOptional()
  secondaryEmail?: string;

  @ApiProperty({
    required: true,
    description: "The user's password",
    example: "password123",
  })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;

  @ApiProperty({
    required: true,
    description: "The ID of the user's role",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Role must be a valid MongoDB ObjectId" })
  role!: string;

  @ApiProperty({
    description: "The ID of the user's department",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Department must be a valid MongoDB ObjectId" })
  @IsOptional()
  department?: string;

  @ApiProperty({
    description: "The ID of the user's designation",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "Designation must be a valid MongoDB ObjectId" })
  @IsOptional()
  designation?: string;
}
