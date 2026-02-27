/**
 * @fileoverview Attendance By Authority DTO
 *
 * Defines the data transfer object for marking attendance on behalf of a user by an authority (e.g., manager).
 * Includes fields for user ID, attendance type, optional date (defaults to today), and optional shift type.
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import {
  AttendanceInType,
  ShiftTypeForOperations,
  ShiftTypeForSales,
} from "../../schemas/attendance.schema";

/**
 * Data Transfer Object for marking attendance on behalf of a user by an authority.
 *
 * Contains the following fields:
 * - userId: The MongoDB ObjectId of the user for whom attendance is being marked (required).
 * - inType: The type of attendance to mark (e.g., present, late, absent) (required).
 * - date: The date for which to mark attendance (optional, defaults to today if not provided).
 * - shiftType: The type of shift (e.g., morning, evening, night) (optional).
 * The AttendanceByAuthorityDto is used in the attendance service to handle requests for marking attendance on behalf of a user by an authority, ensuring that the provided data meets the required format and validation rules before processing the request to create or update attendance records in the system.
 */
export class AttendanceByAuthorityDto {
  @ApiProperty({
    required: false,
    description: "The check-in time for the attendance record (optional)",
    example: "2024-05-01T08:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  checkInTime?: Date;

  @ApiProperty({
    required: false,
    description: "The check-out time for the attendance record (optional)",
    example: "2024-05-01T17:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  checkOutTime?: Date;

  @ApiProperty({
    required: false,
    description:
      "The date(UTC) for which to mark attendance (defaults to today if not provided)",
    example: "2024-05-01T00:00:00.000Z",
  })
  @IsOptional()
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  date?: string;

  @ApiProperty({
    required: true,
    description: "The type of attendance to mark for the user",
    example: AttendanceInType.PRESENT,
    enum: AttendanceInType,
  })
  @IsEnum(AttendanceInType, {
    message: "inType must be a valid AttendanceInType",
  })
  inType!: AttendanceInType;

  @IsOptional()
  @IsEnum(
    [
      ...Object.values(ShiftTypeForSales),
      ...Object.values(ShiftTypeForOperations),
    ],
    { message: "shiftType must be a valid ShiftType for Sales or Operations" },
  )
  shiftType?: string;

  @ApiProperty({
    required: false,
    description: "Whether the attendance is marked as late (optional)",
    example: false,
  })
  @IsOptional()
  isLate?: boolean;
}
