/**
 * @fileoverview Authentication controller.
 *
 * Exposes public endpoints for registration, login, forgot/reset
 * password, as well as authenticated endpoints for password change
 * and logout.
 *
 * @module api-gateway/auth/controller
 */

import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import type { AuthUser } from "@shared/interfaces/auth-user.interface";
import type { Request } from "express";
import { CreateUserDto } from "../../../user-service/src/dto/create-user.dto";
import { ApiErrorResponses } from "../common/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "../common/decorators/api-success-response.decorator";
import { GetUser } from "../common/decorators/get-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ForgotThrottleGuard } from "../common/throttles/forgot-throttle.guard";
import { ResetThrottleGuard } from "../common/throttles/reset-throttle.guard";
import { AuthService } from "./auth.service";
import { ChangePasswordDto } from "./dto/change-password/change-password.dto";
import { ChangePasswordInternalErrorDto } from "./dto/change-password/error/change-password-internal-error.dto";
import { ChangePasswordThrottlerDto } from "./dto/change-password/error/change-password-throttler.dto";
import { ChangePasswordUnauthorizedDto } from "./dto/change-password/error/change-password-unauthorized.dto";
import { ChangePasswordValidationDto } from "./dto/change-password/error/change-password-validation.dto";
import { ChangePasswordSuccessDto } from "./dto/change-password/success/change-password-success.dto";
import { ForgotPasswordInternalErrorDto } from "./dto/forgot-password/error/forgot-password-internal-error.dto";
import { ForgotPasswordThrottlerDto } from "./dto/forgot-password/error/forgot-password-throttler.dto";
import { ForgotPasswordValidationDto } from "./dto/forgot-password/error/forgot-password-validation.dto";
import { ForgotPasswordDto } from "./dto/forgot-password/forgot-password.dto";
import { ForgotPasswordSuccessDto } from "./dto/forgot-password/success/forgot-password-success.dto";
import { LoginInternalErrorDto } from "./dto/login/error/login-internal-error.dto";
import { LoginUnauthorizedDto } from "./dto/login/error/login-unauthorized.dto";
import { LoginValidationDto } from "./dto/login/error/login-validation.dto";
import { LoginDto } from "./dto/login/login.dto";
import { LoginSuccessDto } from "./dto/login/success/login-success.dto";
import { LogoutInternalErrorDto } from "./dto/logout/error/logout-internal-error.dto";
import { LogoutUnauthorizedDto } from "./dto/logout/error/logout-unauthorized.dto";
import { LogoutSuccessDto } from "./dto/logout/success/logout-success.dto";
import { RegistrationEmailConflictDto } from "./dto/registration/error/registration-email-conflict.dto";
import { RegistrationInternalErrorDto } from "./dto/registration/error/registration-internal-error.dto";
import { RegistrationRoleNotFoundDto } from "./dto/registration/error/registration-role-not-found.dto";
import { RegistrationValidationDto } from "./dto/registration/error/registration-validation.dto";
import { RegistrationSuccessDto } from "./dto/registration/success/registration-success.dto";
import { ResetPasswordInternalErrorDto } from "./dto/reset-password/error/reset-password-internal-error.dto";
import { ResetPasswordSuccessDto } from "./dto/reset-password/error/reset-password-success.dto";
import { ResetPasswordThrottlerDto } from "./dto/reset-password/error/reset-password-throttler.dto";
import { ResetPasswordValidationDto } from "./dto/reset-password/error/reset-password-validation.dto";
import { ResetPasswordDto } from "./dto/reset-password/reset-password.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Register a new user account. */
  @ApiOperation({
    summary: "Register a new user account",
    description: "Creates a new user account with the provided details.",
  })
  @ApiSuccessResponse(RegistrationSuccessDto, 201)
  @ApiErrorResponses({
    validation: RegistrationValidationDto,
    notFound: RegistrationRoleNotFoundDto,
    conflict: RegistrationEmailConflictDto,
    internal: RegistrationInternalErrorDto,
  })
  @Post("register")
  async register(@Body() data: CreateUserDto) {
    return await this.authService.register(data);
  }

  /** Authenticate with email & password, receive a bearer token. */
  @ApiOperation({
    summary: "User login",
    description:
      "Authenticates a user with email and password, returning a JWT token.",
  })
  @ApiSuccessResponse(LoginSuccessDto, 200)
  @ApiErrorResponses({
    validation: LoginValidationDto,
    unauthorized: LoginUnauthorizedDto,
    internal: LoginInternalErrorDto,
  })
  @Post("login")
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data.email, data.password);
  }

  /** Request a password-reset OTP (throttled per device). */
  @ApiOperation({
    summary: "Forgot password",
    description: "Sends a password reset OTP to the user's email.",
  })
  @ApiSuccessResponse(ForgotPasswordSuccessDto, 200)
  @ApiErrorResponses({
    validation: ForgotPasswordValidationDto,
    throttle: ForgotPasswordThrottlerDto,
    internal: ForgotPasswordInternalErrorDto,
  })
  @Post("forgot-password")
  @UseGuards(ForgotThrottleGuard)
  async forgot(@Body() data: ForgotPasswordDto) {
    return await this.authService.forgotPassword(data.email);
  }

  /** Verify the OTP and set a new password (throttled per device). */
  @ApiOperation({
    summary: "Reset password",
    description: "Resets the user's password using a valid OTP.",
  })
  @ApiSuccessResponse(ResetPasswordSuccessDto, 200)
  @ApiErrorResponses({
    validation: ResetPasswordValidationDto,
    throttle: ResetPasswordThrottlerDto,
    internal: ResetPasswordInternalErrorDto,
  })
  @Patch("reset-password")
  @UseGuards(ResetThrottleGuard)
  async reset(@Body() data: ResetPasswordDto) {
    return await this.authService.resetPassword(data.otp, data.newPassword);
  }

  /** Change own password (requires current password). */
  @ApiOperation({
    summary: "Change password",
    description: "Changes the authenticated user's password.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(ChangePasswordSuccessDto, 200)
  @ApiErrorResponses({
    validation: ChangePasswordValidationDto,
    unauthorized: ChangePasswordUnauthorizedDto,
    throttle: ChangePasswordThrottlerDto,
    internal: ChangePasswordInternalErrorDto,
  })
  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  async change(@GetUser() user: AuthUser, @Body() data: ChangePasswordDto) {
    return await this.authService.changePassword(
      user._id as string,
      data.currentPassword,
      data.newPassword,
    );
  }

  /** Invalidate the current bearer token (logout). */
  @ApiOperation({
    summary: "User logout",
    description: "Invalidates the current authentication token.",
  })
  @ApiBearerAuth("Authorization")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token",
    required: true,
  })
  @ApiSuccessResponse(LogoutSuccessDto, 200)
  @ApiErrorResponses({
    unauthorized: LogoutUnauthorizedDto,
    internal: LogoutInternalErrorDto,
  })
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const header = req.headers.authorization;
    const headerValue = Array.isArray(header) ? header[0] : header;
    if (!headerValue) throw new UnauthorizedException("No token provided");
    const [type, tokenId] = headerValue.split(" ");
    if (!tokenId || type.toLowerCase() !== "bearer")
      throw new UnauthorizedException("Invalid token format");
    return await this.authService.logout(tokenId);
  }
}
