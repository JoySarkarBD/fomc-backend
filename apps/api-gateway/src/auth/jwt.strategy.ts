import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { firstValueFrom } from "rxjs";
import { jwtConfig } from "../common/jwt.config";
import { USER_COMMANDS } from "../user/constants/user.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject("USER_SERVICE") private userClient: ClientProxy) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret as unknown as string,
    });
  }

  async validate(payload: any) {
    // payload.sub should be user id
    const id = payload.sub;
    if (!id) return null;
    try {
      const user = await firstValueFrom(
        this.userClient.send(USER_COMMANDS.GET_USER, id),
      );
      if (!user) return null;
      delete user.password;
      delete user.otp;
      delete user.otpExpiry;
      return user;
    } catch (err) {
      return null;
    }
  }
}
