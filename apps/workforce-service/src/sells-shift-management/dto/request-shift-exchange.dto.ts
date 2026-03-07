/**
 * @fileoverview This file defines the Data Transfer Objects (DTOs) for handling shift exchange requests and approvals in the Sells Shift Management module of the Workforce Service. The DTOs include validation rules and Swagger documentation to ensure that incoming data is properly structured and validated when employees request shift exchanges or when managers approve them.
 */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ShiftTypeForSales } from "../../schemas/attendance.schema";

/**
 * Data Transfer Object for requesting a shift exchange in the Sells Shift Management module.
 * Contains fields for the date of the shift exchange, the original shift, the new requested shift, and an optional reason for the request.
 * The DTO includes validation rules to ensure that the provided data is in the correct format and adheres to the defined constraints, such as valid date strings and allowed shift types.
 * This DTO is used when an employee submits a request to exchange their assigned shift with another shift, allowing the system to process the request and determine if it can be approved based on the provided information.
 * The validation rules defined in this DTO help maintain data integrity and ensure that only valid shift exchange requests are processed by the Sells Shift Management service, facilitating a smooth and efficient shift exchange process within the workforce management system.
 */
export class RequestShiftExchangeDto {
  @ApiProperty({
    description: "Date for which the shift exchange is requested",
    example: "2024-05-01T08:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  @IsNotEmpty()
  exchangeDate!: string;

  @ApiProperty({
    description: `Current assigned shift - ${Object.values(ShiftTypeForSales).join(", ")}`,
    enum: ShiftTypeForSales,
    example: ShiftTypeForSales.MORNING,
  })
  @IsNotEmpty()
  @IsEnum(ShiftTypeForSales, {
    message: `Invalid originalShift value - ${Object.values(ShiftTypeForSales).join(", ")}`,
  })
  originalShift!: ShiftTypeForSales;

  @ApiProperty({
    description: `Requested new shift - ${Object.values(ShiftTypeForSales).join(", ")}`,
    enum: ShiftTypeForSales,
    example: ShiftTypeForSales.EVENING,
  })
  @IsNotEmpty()
  @IsEnum(ShiftTypeForSales, {
    message: `Invalid newShift value - ${Object.values(ShiftTypeForSales).join(", ")}`,
  })
  newShift!: ShiftTypeForSales;

  @ApiPropertyOptional({
    description: "Reason for the shift exchange request",
    example: "Personal appointment",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ApproveShiftExchangeDto {
  @ApiProperty({
    description: "ID of the shift exchange request to approve",
    example: "60d5ec49f1a4c12d4c8e4b2a",
  })
  @IsNotEmpty()
  @IsString()
  exchangeId!: string;

  @ApiProperty({
    description: "Optional reason for approving the shift exchange",
    example: "Approved due to valid reason provided",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
