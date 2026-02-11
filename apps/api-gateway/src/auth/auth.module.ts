import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { jwtConfig } from "../common/jwt.config";
import { MailModule } from "../utils/mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PASSWORD_THROTTLER } from "./constants/auth-throttle.constants";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    JwtModule.register(jwtConfig),
    PassportModule.register({ defaultStrategy: "jwt" }),
    ThrottlerModule.forRoot({
      throttlers: [PASSWORD_THROTTLER],
    }),
    MailModule,
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST ?? "127.0.0.1",
          port: Number(process.env.USER_SERVICE_PORT ?? 3001),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule, MailModule],
})
export class AuthModule {}
