import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString({ message: "OTP must be a string" })
  @IsNotEmpty({ message: "OTP is required" })
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  otp!: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword!: string;
}
