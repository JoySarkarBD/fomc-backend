import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { firstValueFrom } from "rxjs";
import { jwtConfig } from "../common/jwt.config";
import { USER_COMMANDS } from "../user/constants/user.constants";

/**
 * JWT Strategy for validating JWT tokens in the API Gateway.
 * This strategy uses the passport-jwt library to extract and validate JWT tokens from incoming requests.
 * It communicates with the User Service to retrieve user information based on the user ID contained in the JWT payload.
 * If the user is found and valid, it returns the user information (excluding sensitive fields) for use in request handling; otherwise, it returns null to indicate an invalid token or user.
 * This strategy is used by the JwtAuthGuard to protect routes that require authentication.
 * The validate method is called automatically by the Passport framework when a request with a JWT token is received, and it performs the necessary validation and user retrieval logic.
 * The JWT secret and token extraction method are configured in the constructor, allowing for flexible token handling based on the application's requirements.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject("USER_SERVICE") private userClient: ClientProxy) {
    /**
     * Configure the JWT strategy with options:
     * - jwtFromRequest: Specifies how to extract the JWT token from the request (in this case, from the Authorization header as a Bearer token).
     * - secretOrKey: The secret key used to verify the JWT token's signature, which is obtained from the application's JWT configuration.
     * These options ensure that the strategy can correctly extract and validate JWT tokens from incoming requests, allowing for secure authentication and authorization in the API Gateway.
     */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret as unknown as string,
    });
  }

  /**
   * Validate the JWT payload and retrieve the corresponding user information.
   * @param payload - The decoded JWT payload containing user information (e.g., user ID).
   * @returns The user information if the token is valid and the user exists; otherwise, null.
   */
  async validate(payload: any) {
    const id = payload.sub;
    if (!id) return null;

    try {
      // Retrieve the user information from the User Service using the user ID from the JWT payload.
      const user = await firstValueFrom(
        this.userClient.send(USER_COMMANDS.GET_USER, id),
      );

      // If the user is not found, return null to indicate an invalid token or user.
      if (!user) return null;

      // Remove sensitive fields from the user object before returning it.
      delete user.password;
      delete user.otp;
      delete user.otpExpiry;

      return user;
    } catch (err) {
      return null;
    }
  }
}
