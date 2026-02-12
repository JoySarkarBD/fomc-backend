import { IsEmail } from "class-validator";

/**
 * Data Transfer Object for handling forgot password requests.
 * Contains the email field required for initiating the password reset process.
 * Validates that the email is in a proper email format.
 * Used in the authentication service to handle forgot password requests and ensure that the provided email meets the required format before processing the request.
 * The email field is essential for identifying the user and sending the password reset instructions to the correct email address.
 * The validation rules defined in this DTO help maintain the integrity of the forgot password process and enhance security by enforcing proper input formats.
 */
export class ForgotPasswordDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;
}
