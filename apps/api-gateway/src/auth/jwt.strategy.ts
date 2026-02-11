import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConfig } from "../common/jwt.config";
import { ClientProxy } from "@nestjs/microservices";
import { USER_COMMANDS } from "../user/constants/user.constants";
import { firstValueFrom } from "rxjs";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject("USER_SERVICE") private userClient: ClientProxy) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
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
      delete user.resetToken;
      delete user.resetTokenExpiry;
      return user;
    } catch (err) {
      return null;
    }
  }
}
