import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import * as bcrypt from "bcrypt";
import { firstValueFrom } from "rxjs";
import { USER_COMMANDS } from "../user/constants/user.constants";

@Injectable()
export class AuthService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
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
    if (!user) throw new NotFoundException("Invalid credentials");
    const match = await bcrypt.compare(password, user.password as string);
    if (!match) throw new NotFoundException("Invalid credentials");
    // preserve id for token, then remove sensitive fields
    const id = user.id ?? user._id ?? null;
    delete user.password;
    delete user.resetToken;
    delete user.resetTokenExpiry;

    const payload = { sub: id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async forgotPassword(email: string) {
    const token = Math.random().toString(36).slice(2, 10);
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.SET_RESET_TOKEN, {
        email,
        token,
        expiry: expiry.toISOString(),
      }),
    ).then((ok) => ({ ok, token }));
  }

  async resetPassword(token: string, newPassword: string) {
    return firstValueFrom(
      this.userClient.send(USER_COMMANDS.RESET_PASSWORD, {
        token,
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
