/**
 * @fileoverview Change-password DTO.
 *
 * Validates the current-password / new-password pair submitted
 * by an authenticated user.
 *
 * @module api-gateway/auth/dto
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
    description: "The user's current password",
    example: "currentPassword123",
  })
  @IsString({ message: "Current password must be a string" })
  @MinLength(6, {
    message: "Current password must be at least 6 characters long",
  })
  currentPassword!: string;

  @ApiProperty({
    required: true,
    description: "The user's current password",
    example: "currentPassword123",
  })
  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword!: string;
}
