import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString({ message: "Id must be a string" })
  @IsNotEmpty({ message: "Id is required" })
  id!: string;

  @IsString({ message: "Current password must be a string" })
  @MinLength(6, {
    message: "Current password must be at least 6 characters long",
  })
  currentPassword!: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword!: string;
}
