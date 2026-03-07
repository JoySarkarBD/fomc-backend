/**
 * @fileoverview Leave Request DTO
 *
 * Defines the validation schema for creating a new leave request.
 * Ensures name and description are provided as non-empty strings.
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LeaveType } from "../../schemas/leave.schema";

/**
 * Data Transfer Object for creating a new leave request in the workforce service.
 * Contains fields for leave request name and description, with validation rules to ensure that both fields are required and must be strings.
 * The LeaveRequestDto is used in the leave management service to handle create leave request requests and ensure that the provided data meets the required format before processing the request to create a new leave request in the system.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid leave request information is accepted when creating new leave requests through the workforce service.
 */
export class LeaveRequestDto {
  @ApiProperty({
    required: true,
    description: `The type of the leave request - ${Object.values(LeaveType).join(", ")}`,
    enum: LeaveType,
    example: LeaveType.SICK_LEAVE,
  })
  @IsEnum(LeaveType, {
    message: `type must be a valid enum ${Object.values(LeaveType).join(", ")}`,
  })
  @IsNotEmpty({ message: "type is required" })
  type!: LeaveType;

  @ApiProperty({
    required: true,
    description: "The start date of the leave request UTC format",
    example: "2024-07-01T00:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  startDate!: Date;

  @ApiProperty({
    required: true,
    description: "The end date of the leave request UTC format",
    example: "2024-07-05T00:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  endDate!: Date;

  @ApiProperty({
    required: true,
    description: "The reason for the leave request",
    example: "Personal reasons",
  })
  @IsString({ message: "reason must be a string" })
  reason!: string;
}
