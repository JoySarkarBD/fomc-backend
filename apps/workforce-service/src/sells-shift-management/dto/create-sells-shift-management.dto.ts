/**
 * @fileoverview This file defines the CreateSellsShiftManagementDto class, which is a Data Transfer Object (DTO) used for creating a new sells shift management entry in the workforce service.
 *
 * The CreateSellsShiftManagementDto class includes the following properties:
 * - weekStartDate: A required Date property that represents the start date of the week for the sells shift management. It must be a valid UTC date string.
 * - weekEndDate: A required Date property that represents the end date of the week for the sells shift management. It must be a valid UTC date string.
 * - shiftType: A required property that represents the type of shift for the sells shift management. It must be a valid value from the ShiftTypeForSales enum.
 * - note: An optional string property that can be used to add a note for the sells shift management.
 *
 * The CreateSellsShiftManagementDto class uses decorators from the class-validator library to enforce validation rules on the properties, ensuring that the data provided for creating a new sells shift management entry is valid and correctly formatted before processing the request in the workforce service.
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { ShiftTypeForSales } from "../../schemas/attendance.schema";

/**
 * Data Transfer Object for creating a new sells shift management entry in the workforce service.
 * Contains fields for week start date, week end date, shift type, and an optional note, with validation rules to ensure that the required fields are provided and meet specific validation criteria, ensuring that any new sells shift management entries created in the system are valid and correctly formatted before processing the request to create a new sells shift management entry in the workforce service.
 * The CreateSellsShiftManagementDto is used in the sells shift management service to handle create sells shift management requests and ensure that the provided data meets the required format before processing the request to create a new sells shift management entry in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid sells shift management information is accepted when creating new sells shift management entries through the workforce service.
 */
export class CreateSellsShiftManagementDto {
  @ApiProperty({
    required: true,
    description: "The start date of the week for the sells shift management",
    example: "2024-05-01T08:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  weekStartDate!: Date;

  @ApiProperty({
    required: true,
    description: "The end date of the week for the sells shift management",
    example: "2024-05-07T17:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  weekEndDate!: Date;

  @ApiProperty({
    required: true,
    description: `The type of shift for the sells shift management - ${Object.values(ShiftTypeForSales).join(", ")}`,
    example: ShiftTypeForSales.MORNING,
    enum: ShiftTypeForSales,
  })
  @IsEnum(ShiftTypeForSales, {
    message: `shiftType must be a valid ShiftTypeForSales - ${Object.values(ShiftTypeForSales).join(", ")}`,
  })
  shiftType!: ShiftTypeForSales;

  @ApiProperty({
    required: false,
    description: "An optional note for the sells shift management",
    example: "This is a note for the sells shift management.",
  })
  @IsOptional()
  @IsString({ message: "Note must be a string" })
  note?: string;
}
