import { IsEmail, IsString, MinLength } from "class-validator";

/**
 * Data Transfer Object for user login.
 * Contains the email and password fields required for authentication.
 * Validates that the email is in a proper email format and that the password is a string with a minimum length of 6 characters.
 * Used in the authentication service to handle login requests and ensure that the provided credentials meet the required format before processing the login logic.
 * The email field is essential for identifying the user, while the password field is necessary for verifying the user's identity during the login process.
 * Ensures that the input data for login is valid and prevents invalid data from being processed, which could lead to authentication errors or security issues.
 * The validation rules defined in this DTO help maintain the integrity of the login process and enhance security by enforcing proper input formats.
 */
export class LoginDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;
}
