import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
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
  async forgot(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  @Post("reset-password")
  async reset(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data.token, data.newPassword);
  }

  @Post("change-password")
  async change(@Body() data: ChangePasswordDto) {
    return this.authService.changePassword(
      data.id,
      data.currentPassword,
      data.newPassword,
    );
  }
}
