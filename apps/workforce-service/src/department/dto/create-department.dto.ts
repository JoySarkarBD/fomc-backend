import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object for creating a new department in the workforce service.
 * Contains fields for department name and description, with validation rules to ensure that both fields are required and must be strings.
 * The CreateDepartmentDto is used in the department service to handle create department requests and ensure that the provided data meets the required format before processing the request to create a new department in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid department information is accepted when creating new departments through the workforce service.
 */
export class CreateDepartmentDto {
  @IsString({ message: "Department name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsString({ message: "Department description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  description!: string;
}
