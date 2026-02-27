/**
 * @fileoverview Login DTO.
 *
 * Validates the email / password pair submitted for authentication.
 *
 * @module api-gateway/auth/dto
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    required: true,
    description: "The user's email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @ApiProperty({
    required: true,
    description: "The user's password",
    example: "password123",
  })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;
}
