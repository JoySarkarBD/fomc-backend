/**
 * @fileoverview Reset-password DTO.
 *
 * Validates the OTP + new password pair submitted to complete
 * a password reset.
 *
 * @module api-gateway/auth/dto
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    description: "The OTP sent to the user's email for password reset",
    example: "123456",
  })
  @IsString({ message: "OTP must be a string" })
  @IsNotEmpty({ message: "OTP is required" })
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  otp!: string;

  @ApiProperty({
    required: true,
    description: "The user's new password",
    example: "newPassword123",
  })
  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword!: string;
}
