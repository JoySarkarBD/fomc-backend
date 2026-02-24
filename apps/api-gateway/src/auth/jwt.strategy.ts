/**
 * @fileoverview JWT authentication strategy for the API Gateway.
 * Resolves a UUID bearer token from Redis, verifies the real JWT,
 * and loads the user from the User Service.
 */
import { Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { USER_COMMANDS } from "@shared/constants/user-command.constants";
import type { Request } from "express";
import { Strategy } from "passport-custom";
import { firstValueFrom } from "rxjs";
import { jwtConfig } from "../common/jwt.config";
import { RedisTokenService } from "../common/redis/redis-services/auth/redis-token.service";

/**
 * JWT Strategy for validating tokens in the API Gateway.
 * This strategy accepts a UUID bearer token, resolves the real JWT from Redis,
 * verifies it, and then loads the user from the User Service.
 * If validation fails at any step, it returns null to indicate an invalid token.
 * This strategy is used by the JwtAuthGuard to protect routes that require authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private readonly logger = new Logger(JwtStrategy.name);
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
    if (!tokenId) {
      this.logger.debug("No token id found in Authorization header");
      return null;
    }

    const token = await this.redisTokenService.getToken(tokenId);
    if (!token) {
      this.logger.debug(`Token not found in redis for id=${tokenId}`);
      return null;
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret as unknown as string,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `Failed to verify JWT for tokenId=${tokenId}: ${errorMessage}`,
      );
      return null;
    }

    const id = payload?.sub;
    if (!id) {
      this.logger.debug(`JWT payload missing sub for tokenId=${tokenId}`);
      return null;
    }

    try {
      this.logger.debug(
        `JWT verified, fetching user id=${id} (tokenId=${tokenId})`,
      );
      const user = await firstValueFrom(
        this.userClient.send(USER_COMMANDS.GET_USER, {
          id,
        }),
      );

      if (!user) {
        this.logger.debug(`User not found for id=${id} (tokenId=${tokenId})`);
        return null;
      }

      delete user.password;
      delete user.otp;
      delete user.otpExpiry;

      this.logger.debug(
        `Authentication succeeded for user id=${id} (tokenId=${tokenId})`,
      );
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Error fetching user for id=${id}: ${errorMessage}`);
      return null;
    }
  }
}
