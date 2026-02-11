import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import * as bcrypt from "bcrypt";
import { firstValueFrom } from "rxjs";
import { USER_COMMANDS } from "../user/constants/user.constants";
import { MailService } from "../utils/mail.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(data: any) {
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.CREATE_USER, data),
    );
  }

  async login(email: string, password: string) {
    const user = await firstValueFrom(
      this.userClient.send(USER_COMMANDS.FIND_BY_EMAIL, email),
    );
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const match = await bcrypt.compare(password, user.password as string);

    if (!match) throw new UnauthorizedException("Invalid credentials");
    // preserve id for token, then remove sensitive fields
    const id = user.id ?? user._id ?? null;
    delete user.password;
    delete user.otp;
    delete user.otpExpiry;

    const payload = { sub: id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async forgotPassword(email: string) {
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.SET_RESET_PASSWORD_OTP, {
        email,
        otp: otp,
        expiry: expiry.toISOString(),
      }),
    ).then((ok) => {
      if (ok) {
        // send OTP by email
        this.mailService.sendMail({
          to: email,
          subject: "Your password reset OTP",
          html: `<p>Your password reset code is <strong>${otp}</strong>. It expires in 15 minutes.</p>`,
          text: `Your password reset code is ${otp}. It expires in 15 minutes.`,
        });
      }
      return { ok };
    });
  }

  async resetPassword(otp: string, newPassword: string) {
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.RESET_PASSWORD, {
        otp,
        newPassword,
      }),
    );
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.CHANGE_PASSWORD, {
        id,
        currentPassword,
        newPassword,
      }),
    );
  }
}
