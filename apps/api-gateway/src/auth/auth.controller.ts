import { Body, Controller, Post, Put, UseGuards } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { GetUser } from "../common/decorators/get-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthUser } from "../common/interfaces/auth-user.interface";
import { AuthService } from "./auth.service";
import { PASSWORD_THROTTLE } from "./constants/auth-throttle.constants";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

/**
 * AuthController
 *
 * Handles authentication-related routes:
 * - User registration
 * - User login
 * - Forgot password / reset password
 * - Change password
 *
 * Includes rate-limiting on sensitive endpoints and JWT guard for protected routes.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   *
   * @param {RegisterDto} data - User registration data
   * @returns {Promise<any>} Service response with newly created user
   */
  @Post("register")
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  /**
   * Authenticate a user and return a JWT token.
   *
   * @param {LoginDto} data - User login credentials
   * @returns {Promise<any>} Service response containing access token and user data
   */
  @Post("login")
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

  /**
   * Request a password reset OTP.
   *
   * Rate-limited to prevent abuse.
   *
   * @param {ForgotPasswordDto} data - Contains the user's email
   * @returns {Promise<any>} Service response indicating OTP sent status
   */
  @Post("forgot-password")
  @UseGuards(ThrottlerGuard)
  @Throttle(PASSWORD_THROTTLE)
  async forgot(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  /**
   * Reset the user's password using OTP.
   *
   * @param {ResetPasswordDto} data - Contains OTP and new password
   * @returns {Promise<any>} Service response indicating password reset success
   */
  @Post("reset-password")
  async reset(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data.otp, data.newPassword);
  }

  /**
   * Change the password of a logged-in user.
   *
   * Protected route, requires JWT authentication.
   *
   * @param {AuthUser} user - Authenticated user object (injected by GetUser decorator)
   * @param {ChangePasswordDto} data - Contains current and new password
   * @returns {Promise<any>} Service response indicating password change success
   */
  @Put("change-password")
  @UseGuards(JwtAuthGuard)
  async change(@GetUser() user: AuthUser, @Body() data: ChangePasswordDto) {
    return this.authService.changePassword(
      user._id as string,
      data.currentPassword,
      data.newPassword,
    );
  }
}
