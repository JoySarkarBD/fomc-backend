/** @fileoverview UpdateUserDto. Partial validation schema for user update payloads. @module user-service/dto/update-user.dto */
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

/**
 * Data Transfer Object for updating user information in the API Gateway.
 * Contains fields for user information such as name, employee ID, phone number, email, secondary email, password, role, and department.
 * Validates that the fields are optional and meet specific validation criteria if provided, ensuring that any updates to user information are valid and correctly formatted before processing the request to update a user in the system.
 * The UpdateUserDto is used in the user service to handle update user requests and ensure that the provided data meets the required format before processing the request to update an existing user in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid user information is accepted when updating users through the API Gateway.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    required: true,
    description: "The ID of the user to update",
    example: "60c72b2f9b1d8e5a5c8f9e7d",
  })
  @IsMongoId({ message: "ID must be a valid Mongo ID" })
  id!: string;
}
