import {
  Body,
  Controller,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { CreateUserDto } from "../../../user-service/src/dto/create-user.dto";
import { GetUser } from "../common/decorators/get-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { AuthUser } from "../common/interfaces/auth-user.interface";
import { ForgotThrottleGuard } from "../common/throttles/forgot-throttle.guard";
import { ResetThrottleGuard } from "../common/throttles/reset-throttle.guard";
import { AuthService } from "./auth.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

/**
 * Authentication Controller responsible for handling authentication-related HTTP requests.
 * Provides endpoints for user registration, login, password reset, and password change.
 * Utilizes the AuthService to perform the necessary business logic for each authentication operation.
 * Includes guards and throttling to enhance security, particularly for password reset requests.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user registration.
   * Accepts a RegisterDto containing the user's name, email, phone number, and password.
   * Validates the input data and creates a new user account using the AuthService.
   * Returns the result of the registration process, which may include user details or a success message.
   */
  @Post("register")
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  /**
   * Endpoint for user login.
   * Accepts a LoginDto containing the user's email and password.
   * Validates the input data and attempts to authenticate the user using the AuthService.
   * Returns a JWT token or an error message based on the authentication result.
   */
  @Post("login")
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

  /**
   * Endpoint for initiating the password reset process.
   * Accepts a ForgotPasswordDto containing the user's email address.
   * Validates the input data and triggers the password reset process using the AuthService, which may involve sending an OTP to the user's email.
   * Utilizes throttling to prevent abuse of the password reset functionality, limiting the number of requests that can be made within a certain time frame.
   * Returns a success message or an error message based on the result of the password reset initiation.
   */
  @Post("forgot-password")
  @UseGuards(ForgotThrottleGuard)
  async forgot(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  /**
   * Endpoint for resetting the user's password.
   * Accepts a ResetPasswordDto containing the OTP and the new password.
   * Validates the input data and attempts to reset the user's password using the AuthService, which verifies the OTP and updates the password if valid.
   * Returns a success message or an error message based on the result of the password reset operation.
   */
  @Patch("reset-password")
  @UseGuards(ResetThrottleGuard)
  async reset(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data.otp, data.newPassword);
  }

  /**
   * Endpoint for changing the user's password.
   * Protected by the JwtAuthGuard to ensure that only authenticated users can access this endpoint.
   * Accepts a ChangePasswordDto containing the current password and the new password.
   * Validates the input data and attempts to change the user's password using the AuthService, which verifies the current password and updates it if valid.
   * Returns a success message or an error message based on the result of the password change operation.
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

  /**
   * Endpoint for logging out the user.
   * Protected by the JwtAuthGuard to ensure that only authenticated users can access this endpoint.
   * Retrieves the authenticated user's information using the GetUser decorator and calls the AuthService to perform the logout operation, which may involve invalidating the user's JWT token in Redis.
   * Returns a success message or an error message based on the result of the logout operation.
   */
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const header = req.headers.authorization;

    const headerValue = Array.isArray(header) ? header[0] : header;

    if (!headerValue) throw new UnauthorizedException("No token provided");

    const [type, tokenId] = headerValue.split(" ");

    if (!tokenId || type.toLowerCase() !== "bearer")
      throw new UnauthorizedException("Invalid token format");

    return this.authService.logout(tokenId);
  }
}
