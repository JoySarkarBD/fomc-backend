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

/**
 * Authentication Module responsible for managing authentication-related functionality within the API Gateway.
 * This module imports necessary dependencies such as JWT handling, microservices communication, and throttling.
 * It provides the AuthController to handle authentication-related HTTP requests and the AuthService to perform the business logic for authentication operations.
 * The module also exports relevant services and modules for use in other parts of the application.
 */
@Module({
  imports: [
    /**
     * JWT Module configured with the application's JWT settings, enabling JWT-based authentication and token management.
     * This allows the application to generate and validate JWT tokens for user authentication and authorization.
     */
    JwtModule.register(jwtConfig),
    PassportModule.register({ defaultStrategy: "jwt" }),

    /**
     * Throttler Module configured with a custom throttler for password-related operations, providing rate limiting to enhance security and prevent abuse of authentication endpoints, particularly those related to password resets.
     * This helps to mitigate brute-force attacks and ensures that users cannot make excessive requests to sensitive endpoints.
     */
    ThrottlerModule.forRoot({
      throttlers: [PASSWORD_THROTTLER],
    }),

    /**
     * Mail Module responsible for handling email-related functionality, such as sending OTPs for password resets and other authentication-related notifications.
     * This module provides services for sending emails, which can be utilized by the AuthService to communicate with users during authentication processes, particularly for password reset workflows.
     */
    MailModule,

    /**
     * Clients Module configured to register a microservice client for the User Service, enabling communication between the API Gateway and the User Service over TCP.
     * This allows the AuthService to interact with the User Service for operations such as user registration, authentication, and password management, facilitating a microservices architecture where different services can communicate seamlessly.
     */
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

  /**
   * Controllers responsible for handling incoming HTTP requests related to authentication, such as user registration, login, password reset, and password change.
   * The AuthController defines the endpoints and request handling logic for these operations, utilizing the AuthService to perform the necessary business logic.
   */
  controllers: [AuthController],

  /**
   * Providers responsible for implementing the business logic for authentication operations, such as user registration, login, password reset, and password change.
   * The AuthService contains methods that perform these operations, interacting with the User Service and other dependencies as needed.
   * The JwtStrategy is also provided to handle JWT validation and authentication logic for protected routes.
   */
  providers: [AuthService, JwtStrategy],

  /**
   * Exports the JwtModule, PassportModule, and MailModule to make their services available for use in other modules of the application.
   * This allows other parts of the application to utilize JWT handling, authentication strategies, and email functionality provided by these modules, facilitating a modular and reusable architecture.
   */
  exports: [JwtModule, PassportModule, MailModule],
})
export class AuthModule {}
