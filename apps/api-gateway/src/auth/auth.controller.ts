import { Body, Controller, Post, UseGuards } from "@nestjs/common";
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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post("login")
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

  @Post("forgot-password")
  @UseGuards(ThrottlerGuard)
  @Throttle(PASSWORD_THROTTLE)
  async forgot(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  @Post("reset-password")
  async reset(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data.otp, data.newPassword);
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  async change(@GetUser() user: AuthUser, @Body() data: ChangePasswordDto) {
    return this.authService.changePassword(
      (user.id ?? user._id) as string,
      data.currentPassword,
      data.newPassword,
    );
  }
}
