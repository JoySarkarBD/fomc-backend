import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import * as bcrypt from "bcrypt";
import { firstValueFrom } from "rxjs";
import { buildResponse } from "../common/response.util";
import { USER_COMMANDS } from "../user/constants/user.constants";
import { MailService } from "../utils/mail.service";

/**
 * AuthService
 *
 * Handles authentication and password management for users.
 *
 * Responsibilities:
 * - Register new users
 * - Authenticate users (login)
 * - Forgot password and OTP-based password reset
 * - Change password
 * - Generate JWT tokens
 */
@Injectable()
export class AuthService {
  /** OTP time-to-live in minutes */
  private readonly otpTtlMinutes = 15;

  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
   * Remove sensitive fields from a user object.
   * @param {any} user - User object from microservice
   * @returns {any} Sanitized user object
   */
  private sanitizeUser(user: any) {
    const { password, otp, otpExpiry, ...safeUser } = user ?? {};
    return safeUser;
  }

  /**
   * Register a new user.
   * @param {any} data - Registration data (name, email, password, etc.)
   * @returns {Promise<any>} Standardized service response
   */
  async register(data: any) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.CREATE_USER, data),
    );
    return buildResponse("Registration successful", user);
  }

  /**
   * Authenticate a user and generate JWT token.
   * @param {string} email - User email
   * @param {string} password - User password
   * @throws {UnauthorizedException} If credentials are invalid
   * @returns {Promise<any>} Standardized service response with JWT token
   */
  async login(email: string, password: string) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.FIND_BY_EMAIL, email),
    );
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await bcrypt.compare(password, user.password as string);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    const id = user.id ?? user._id ?? null;
    const safeUser = this.sanitizeUser(user);
    const payload = { sub: id, email: safeUser.email, role: safeUser.role };
    const accessToken = this.jwtService.sign(payload);

    return buildResponse("Login successful", {
      accessToken,
      user: safeUser,
    });
  }

  /**
   * Initiate forgot password process by generating an OTP and sending it via email.
   * @param {string} email - User email
   * @returns {Promise<any>} Standardized service response
   */
  async forgotPassword(email: string) {
    const otp = this.generateOtp();
    const expiry = this.getOtpExpiryDate();
    const ok = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.SET_RESET_PASSWORD_OTP, {
        email,
        otp: otp,
        expiry: expiry.toISOString(),
      }),
    );
    if (ok) {
      await this.sendPasswordResetEmail(email, otp);
    }
    return buildResponse("OTP sent successfully", null);
  }

  /**
   * Reset a user's password using an OTP.
   * @param {string} otp - OTP code sent to user's email
   * @param {string} newPassword - New password to set
   * @returns {Promise<any>} Standardized service response
   */
  async resetPassword(otp: string, newPassword: string) {
    const result = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.RESET_PASSWORD, {
        otp,
        newPassword,
      }),
    );
    if (!result) throw new UnauthorizedException("Invalid or expired OTP");
    return buildResponse("Password reset successful", null);
  }

  /**
   * Change password for a logged-in user.
   * @param {string} id - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password to set
   * @returns {Promise<any>} Standardized service response
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    await firstValueFrom(
      this.userClient.send(USER_COMMANDS.CHANGE_PASSWORD, {
        id,
        currentPassword,
        newPassword,
      }),
    );
    return buildResponse("Password changed successfully", null);
  }
}
