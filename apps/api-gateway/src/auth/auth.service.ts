import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { firstValueFrom } from "rxjs";
import config from "../../../config/config";
import { RedisTokenService } from "../common/redis/redis-token.service";
import { buildResponse } from "../common/response.util";
import { USER_COMMANDS } from "../user/constants/user.constants";
import { MailService } from "../utils/mail.service";

@Injectable()
export class AuthService {
  /** OTP time-to-live in minutes */
  private readonly otpTtlMinutes = 15;

  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly redisTokenService: RedisTokenService,
  ) {}

  /**
   * Generate a 6-digit numeric OTP.
   * @returns {string} 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Get the expiry date for an OTP based on TTL.
   * @returns {Date} OTP expiry date
   */
  private getOtpExpiryDate(): Date {
    return new Date(Date.now() + this.otpTtlMinutes * 60 * 1000);
  }

  /**
   * Send password reset OTP email to a user.
   * @param {string} email - User's email
   * @param {string} otp - OTP to send
   */
  private async sendPasswordResetEmail(
    email: string,
    otp: string,
  ): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: "Your password reset OTP",
      html: `<p>Your password reset code is <strong>${otp}</strong>. It expires in ${this.otpTtlMinutes} minutes.</p>`,
      text: `Your password reset code is ${otp}. It expires in ${this.otpTtlMinutes} minutes.`,
    });
  }

  /**
   * Sanitize user object by removing sensitive fields before returning it in responses or attaching it to requests.
   * @param user - The user object to sanitize
   * @returns The sanitized user object without sensitive fields
   */
  private sanitizeUser(user: any) {
    const { password, otp, otpExpiry, ...safeUser } = user ?? {};
    return safeUser;
  }

  /**
   * Register a new user by sending the registration data to the User Service.
   * If the email already exists, a ConflictException is thrown.
   * @param data - The registration data containing name, email, phone number, and password
   * @returns A response indicating successful registration or an error message if the email already exists
   */
  async register(data: any) {
    // Send registration data to User Service and handle response
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.CREATE_USER, data),
    );

    // If the email already exists, throw a ConflictException with the message from the User Service response
    if (user?.emailExist) {
      throw new ConflictException(user.message);
    }

    // Return a success response with the created user details (excluding sensitive fields)
    const safeUser = this.sanitizeUser(user);
    return buildResponse("Registration successful", safeUser);
  }

  /**
   * Authenticate a user by validating their email and password against the User Service.
   * If authentication is successful, a JWT token is generated and returned along with user details (excluding sensitive fields).
   * If authentication fails due to invalid credentials, an UnauthorizedException is thrown.
   * @param email - The user's email address
   * @param password - The user's password
   * @returns A response containing a JWT token and user details if authentication is successful, or an error message if authentication fails
   */
  async login(email: string, password: string) {
    // Fetch user from User Service by email
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.FIND_BY_EMAIL, email),
    );

    // If user is not found or password does not match, throw an UnauthorizedException with a generic message to avoid revealing which part is incorrect
    if (!user) throw new UnauthorizedException("Invalid credentials");

    // Compare the provided password with the hashed password stored in the User Service using bcrypt
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    // Generate a JWT token with the user's ID, email, and role as the payload, and return it along with sanitized user details in the response
    const id = user.id ?? user._id ?? null;
    const safeUser = this.sanitizeUser(user);
    const payload = { sub: id, email: safeUser.email, role: safeUser.role };
    const accessToken = this.jwtService.sign(payload);
    const tokenId = randomUUID();

    await this.redisTokenService.storeToken(
      tokenId,
      accessToken,
      config.JWT_EXPIRES_IN ? Number(config.JWT_EXPIRES_IN) : 2592000,
    );

    // Return a success response with the generated JWT token and sanitized user details
    return buildResponse("Login successful", {
      accessToken: tokenId,
      user: safeUser,
    });
  }

  /**
   * Initiate the password reset process by generating an OTP, storing it in the User Service, and sending it to the user's email.
   * The OTP is valid for a limited time (defined by otpTtlMinutes) to enhance security.
   * If the email is associated with a user account, an OTP is generated and sent; otherwise, a success response is returned without indicating that the email does not exist to prevent information disclosure.
   * @throws UnauthorizedException if the OTP cannot be set in the User Service, indicating a potential issue with the email or user account.
   * @returns A response indicating that the OTP has been sent successfully, regardless of whether the email exists in the system, to prevent information disclosure about user accounts.
   */
  async forgotPassword(email: string) {
    // Generate a 6-digit OTP and calculate its expiry date
    const otp = this.generateOtp();
    const expiry = this.getOtpExpiryDate();

    // Send the OTP and its expiry to the User Service to associate it with the user's account for password reset purposes
    const ok = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.SET_RESET_PASSWORD_OTP, {
        email,
        otp: otp,
        expiry: expiry.toISOString(),
      }),
    );

    // If the OTP was successfully set in the User Service, send the password reset email to the user with the generated OTP. If not, we still return a success response to avoid revealing whether the email exists in the system.
    if (ok) {
      await this.sendPasswordResetEmail(email, otp);
    }

    // Return a success response indicating that the OTP has been sent, regardless of whether the email exists in the system, to prevent information disclosure about user accounts.
    return buildResponse("OTP sent successfully", null);
  }

  /**
   * Reset the user's password by verifying the provided OTP and updating the password in the User Service.
   * If the OTP is valid and the password reset is successful, a success response is returned. If the OTP is invalid or expired, an UnauthorizedException is thrown.
   * @param otp - The OTP provided by the user for password reset verification
   * @param newPassword - The new password to be set for the user
   * @throws UnauthorizedException if the OTP is invalid or expired, indicating that the password reset cannot be performed.
   * @returns A response indicating that the password has been reset successfully if the OTP is valid, or an error message if the OTP is invalid or expired.
   */
  async resetPassword(otp: string, newPassword: string) {
    // Send the OTP and new password to the User Service to attempt the password reset. The User Service will verify the OTP and update the password if valid.
    const result = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.RESET_PASSWORD, {
        otp,
        newPassword,
      }),
    );

    // If the result indicates that the OTP is invalid or expired, throw an UnauthorizedException with a generic message to avoid revealing specific details about the failure.
    if (!result) throw new UnauthorizedException("Invalid or expired OTP");

    // Return a success response indicating that the password has been reset successfully if the OTP is valid and the password reset operation was successful.
    return buildResponse("Password reset successful", null);
  }

  /**
   * Change the user's password by verifying the current password and updating it to the new password in the User Service.
   * This operation is protected by authentication to ensure that only the authenticated user can change their password.
   * If the current password is correct and the password change is successful, a success response is returned. If the current password is incorrect or the change fails, an UnauthorizedException is thrown.
   * @param id - The ID of the authenticated user requesting the password change
   * @param currentPassword - The user's current password for verification
   * @param newPassword - The new password to be set for the user
   * @throws UnauthorizedException if the current password is incorrect or the password change operation fails, indicating that the password cannot be changed.
   * @returns A response indicating that the password has been changed successfully if the current password is correct and the change operation was successful, or an error message if the current password is incorrect or the change fails.
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    // Send the user ID, current password, and new password to the User Service to attempt the password change. The User Service will verify the current password and update it to the new password if valid.
    const result = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.CHANGE_PASSWORD, {
        id,
        currentPassword,
        newPassword,
      }),
    );

    // If the result indicates that the current password is incorrect or the password change operation failed, throw an UnauthorizedException with a generic message to avoid revealing specific details about the failure.
    if (!result || !result.success) {
      throw new UnauthorizedException(
        result?.message ?? "Password change failed",
      );
    }

    // Return a success response indicating that the password has been changed successfully if the current password is correct and the password change operation was successful.
    return buildResponse("Password changed successfully", null);
  }
}
