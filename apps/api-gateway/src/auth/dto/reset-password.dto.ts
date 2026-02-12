import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

/**
 * Data Transfer Object for resetting a user's password.
 * Contains the OTP and new password fields required for the password reset process.
 * Validates that the OTP is a non-empty string with exactly 6 digits and that the new password is a string with a minimum length of 6 characters.
 * Used in the authentication service to handle password reset requests after the user has received an OTP via email.
 * The OTP field is essential for verifying the user's identity and ensuring that the password reset request is legitimate.
 * The new password field must meet the minimum length requirement for security reasons, ensuring that users create strong passwords to protect their accounts.
 * The validation rules defined in this DTO help maintain the integrity of the password reset process and enhance security by enforcing proper input formats.
 */
export class ResetPasswordDto {
  @IsString({ message: "OTP must be a string" })
  @IsNotEmpty({ message: "OTP is required" })
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  otp!: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword!: string;
}
