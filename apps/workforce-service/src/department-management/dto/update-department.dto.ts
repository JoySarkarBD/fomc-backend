/**
 * @fileoverview Update Department DTO
 *
 * Defines the validation schema for updating an existing department.
 * Extends CreateDepartmentDto with all fields made optional via PartialType.
 */
import { ApiExtraModels, PartialType } from "@nestjs/swagger";
import { CreateDepartmentDto } from "./create-department.dto";

/**
 * Data Transfer Object for updating department information in the workforce service.
 * Contains fields for department name and description, with validation rules to ensure that the fields are optional and meet specific validation criteria if provided, ensuring that any updates to department information are valid and correctly formatted before processing the request to update a department in the system.
 * The UpdateDepartmentDto is used in the department service to handle update department requests and ensure that the provided data meets the required format before processing the request to update an existing department in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid department information is accepted when updating departments through the workforce service.
 */
@ApiExtraModels(CreateDepartmentDto)
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
