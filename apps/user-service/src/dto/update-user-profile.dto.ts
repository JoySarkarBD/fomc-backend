/** @fileoverview UpdateUserProfileDto. Validation schema for user profile updates. @module user-service/dto/update-user-profile.dto */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Data Transfer Object for updating a user's profile fields.
 * Allows updating only name and avatar path.
 */
export class UpdateUserProfileDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  @MaxLength(120, { message: "Name must be at most 120 characters" })
  name!: string;

  @IsOptional()
  @IsString({ message: "Avatar must be a string" })
  avatar?: string;
}
