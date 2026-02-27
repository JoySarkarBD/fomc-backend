/**
 * @fileoverview Forgot-password DTO.
 *
 * Validates the email submitted when requesting a password-reset OTP.
 *
 * @module api-gateway/auth/dto
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
    description: "The email address associated with the user's account",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;
}
