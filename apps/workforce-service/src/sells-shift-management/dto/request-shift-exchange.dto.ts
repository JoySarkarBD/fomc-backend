import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ShiftTypeForSales } from "../../schemas/attendance.schema";

export class RequestShiftExchangeDto {
  @ApiProperty({
    description: "Date for which the shift exchange is requested",
    example: "2024-05-01T08:00:00.000Z",
  })
  @IsDateString({}, { message: "Date must be a valid UTC date string" })
  @IsNotEmpty()
  exchangeDate!: string;

  @ApiProperty({
    description: "Current assigned shift",
    enum: ShiftTypeForSales,
    example: ShiftTypeForSales.MORNING,
  })
  @IsNotEmpty()
  @IsEnum(ShiftTypeForSales)
  originalShift!: ShiftTypeForSales;

  @ApiProperty({
    description: "Requested new shift",
    enum: ShiftTypeForSales,
    example: ShiftTypeForSales.EVENING,
  })
  @IsNotEmpty()
  @IsEnum(ShiftTypeForSales)
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
