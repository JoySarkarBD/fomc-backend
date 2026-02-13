import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { RESET_PASSWORD } from "../../auth/constants/auth-throttle.constants";
import { RedisClientService } from "../../common/redis/redis.client";
import {
  BaseThrottleGuard,
  ThrottleConfig,
} from "../../common/throttles/base-throttle.guard";

/**
 * Guard to throttle "reset password" requests based on device + email + token.
 */
@Injectable()
export class ResetThrottleGuard extends BaseThrottleGuard {
  constructor(redis: RedisClientService) {
    const config: ThrottleConfig = {
      keyPrefix: RESET_PASSWORD.KEY_PREFIX,
      ttlSeconds: RESET_PASSWORD.TTL_SECONDS,
      limit: RESET_PASSWORD.LIMIT,
    };
    super(redis, config);
  }

  /**
   * Build unique identifier from deviceId for throttling.
   * @param req - Express request
   * @returns string identifier
   * @throws HttpException if deviceId is missing
   */
  protected buildIdentifier(req: Request): string {
    const deviceId = req.headers["x-device-id"] as string;
    if (!deviceId) {
      throw new HttpException(
        "Device identifier missing - x-device-id header is required",
        HttpStatus.BAD_REQUEST,
      );
    }

    return `${deviceId}`;
  }
}
