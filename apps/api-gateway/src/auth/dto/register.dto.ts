import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * Data Transfer Object for user registration.
 * Contains the name, email, phone number, and password fields required for creating a new user account.
 * Validates that the name and phone number are non-empty strings, the email is in a proper email format, and the password is a string with a minimum length of 6 characters.
 * Used in the authentication service to handle registration requests and ensure that the provided data meets the required format before processing the registration logic.
 * The name and phone number fields are essential for identifying the user and providing contact information, while the email field is necessary for account verification and communication.
 * The password field must meet the minimum length requirement for security reasons, ensuring that users create strong passwords to protect their accounts.
 * The validation rules defined in this DTO help maintain the integrity of the registration process and enhance security by enforcing proper input formats.
 */
export class RegisterDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  phoneNumber!: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;
}
