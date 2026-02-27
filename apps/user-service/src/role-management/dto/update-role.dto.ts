/** @fileoverview UpdateRoleDto. Partial validation schema for role update payloads. @module user-service/role/dto/update-role.dto */
import { ApiExtraModels, PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "./create-role.dto";

/**
 * Data Transfer Object for updating role information in the user service.
 * Contains fields for role name and description, with validation rules to ensure that the fields are optional and meet specific validation criteria if provided, ensuring that any updates to role information are valid and correctly formatted before processing the request to update a role in the system.
 * The UpdateRoleDto is used in the role service to handle update role requests and ensure that the provided data meets the required format before processing the request to update an existing role in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid role information is accepted when updating roles through the user service.
 */
@ApiExtraModels(CreateRoleDto)
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
