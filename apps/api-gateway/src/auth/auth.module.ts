/**
 * @fileoverview Authentication module for the API Gateway.
 * Registers JWT, Passport, Redis, mail, and User Service microservice client.
 */
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport";
import config from "@shared/config/app.config";
import { jwtConfig } from "../common/jwt.config";
import { RedisModule } from "../common/redis/redis.module";
import { ForgotThrottleGuard } from "../common/throttles/forgot-throttle.guard";
import { ResetThrottleGuard } from "../common/throttles/reset-throttle.guard";
import { DepartmentService } from "../department/department.service";
import { DesignationService } from "../designation/designation.service";
import { MailModule } from "../utils/mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

/**
 * Auth module – registers JWT, Passport, mail, Redis, and User Service client.
 */
@Module({
  imports: [
    /** JWT token generation and validation. */
    JwtModule.register(jwtConfig),
    PassportModule.register({ defaultStrategy: "jwt" }),

    /** Email sending (OTPs, notifications). */
    MailModule,

    /** Redis-backed token / session store. */
    RedisModule,

    /** TCP client for the User Service microservice. */
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: config.USER_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.USER_SERVICE_PORT ?? 3001),
        },
      },
      {
        name: "WORKFORCE_SERVICE",
        transport: Transport.TCP,
        options: {
          host: config.WORKFORCE_SERVICE_HOST ?? "127.0.0.1",
          port: Number(config.WORKFORCE_SERVICE_PORT ?? 3002),
        },
      },
    ]),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    DepartmentService,
    JwtStrategy,
    ForgotThrottleGuard,
    ResetThrottleGuard,
    DesignationService,
  ],

  exports: [
    JwtModule,
    PassportModule,
    MailModule,
    DepartmentService,
    DesignationService,
  ],
})
export class AuthModule {}
