/** @fileoverview UpdateUserProfileDto. Validation schema for user profile updates. @module user-service/dto/update-user-profile.dto */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Data Transfer Object for updating a user's profile fields.
 * Allows updating only name and avatar path.
 */
export class UpdateUserProfileDto {
  @ApiProperty({
    required: true,
    description: "The full name of the user",
    example: "John Doe",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  @MaxLength(120, { message: "Name must be at most 120 characters" })
  name!: string;

  @ApiProperty({
    required: false,
    description: "The avatar path of the user",
    example: "/avatars/user123.jpg",
  })
  @IsOptional()
  @IsString({ message: "Avatar must be a string" })
  avatar?: string;
}
