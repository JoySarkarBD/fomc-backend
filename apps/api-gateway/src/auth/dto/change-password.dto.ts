import { IsString, MinLength } from "class-validator";

/**
 * Data Transfer Object for changing a user's password.
 * Contains the current password and new password fields required for the password change process.
 * Validates that the current password is a string with a minimum length of 6 characters and that the new password is also a string with a minimum length of 6 characters.
 * Used in the authentication service to handle change password requests and ensure that the provided data meets the required format before processing the request.
 * The current password field is essential for verifying the user's identity and ensuring that the password change request is legitimate, while the new password field must meet the minimum length requirement for security reasons, ensuring that users create strong passwords to protect their accounts.
 * The validation rules defined in this DTO help maintain the integrity of the password change process and enhance security by enforcing proper input formats.
 */
export class ChangePasswordDto {
  @IsString({ message: "Current password must be a string" })
  @MinLength(6, {
    message: "Current password must be at least 6 characters long",
  })
  currentPassword!: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword!: string;
}
