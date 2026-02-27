/**
 * @fileoverview Update Designation DTO
 *
 * Defines the validation schema for updating an existing designation.
 * Extends CreateDesignationDto with all fields made optional via PartialType.
 */
import { ApiExtraModels, PartialType } from "@nestjs/swagger";
import { CreateDesignationDto } from "./create-designation.dto";

/**
 * Data Transfer Object for updating designation information in the workforce service.
 * Contains fields for designation name and description, with validation rules to ensure that the fields are optional and meet specific validation criteria if provided, ensuring that any updates to designation information are valid and correctly formatted before processing the request to update a designation in the system.
 * The UpdateDesignationDto is used in the designation service to handle update designation requests and ensure that the provided data meets the required format before processing the request to update an existing designation in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid designation information is accepted when updating designations through the workforce service.
 */
@ApiExtraModels(CreateDesignationDto)
export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {}
