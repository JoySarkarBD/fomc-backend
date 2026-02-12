import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Strategy } from "passport-custom";
import { firstValueFrom } from "rxjs";
import { jwtConfig } from "../common/jwt.config";
import { RedisTokenService } from "../common/redis/redis-token.service";
import { USER_COMMANDS } from "../user/constants/user.constants";

/**
 * JWT Strategy for validating tokens in the API Gateway.
 * This strategy accepts a UUID bearer token, resolves the real JWT from Redis,
 * verifies it, and then loads the user from the User Service.
 * If validation fails at any step, it returns null to indicate an invalid token.
 * This strategy is used by the JwtAuthGuard to protect routes that require authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @Inject("USER_SERVICE") private userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly redisTokenService: RedisTokenService,
  ) {
    super();
  }

  private extractTokenId(request: Request): string | null {
    const header = request.headers.authorization;
    const headerValue = Array.isArray(header) ? header[0] : header;
    if (!headerValue) return null;

    const [type, value] = headerValue.split(" ");
    if (!value || type.toLowerCase() !== "bearer") return null;

    return value;
  }

  /**
   * Validate the JWT payload and retrieve the corresponding user information.
   * @param payload - The decoded JWT payload containing user information (e.g., user ID).
   * @returns The user information if the token is valid and the user exists; otherwise, null.
   */
  async validate(request: Request) {
    const tokenId = this.extractTokenId(request);
    if (!tokenId) return null;

    const token = await this.redisTokenService.getToken(tokenId);
    if (!token) return null;
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret as unknown as string,
      });
    } catch {
      return null;
    }

    const id = payload?.sub;
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
