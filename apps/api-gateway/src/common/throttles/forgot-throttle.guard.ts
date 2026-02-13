import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { FORGOT_PASSWORD } from "../../auth/constants/auth-throttle.constants";
import { RedisClientService } from "../../common/redis/redis.client";
import {
  BaseThrottleGuard,
  ThrottleConfig,
} from "../../common/throttles/base-throttle.guard";

/**
 * Guard to throttle "forgot password" requests based on device + email.
 */
@Injectable()
export class ForgotThrottleGuard extends BaseThrottleGuard {
  constructor(redis: RedisClientService) {
    const config: ThrottleConfig = {
      keyPrefix: FORGOT_PASSWORD.KEY_PREFIX,
      ttlSeconds: FORGOT_PASSWORD.TTL_SECONDS,
      limit: FORGOT_PASSWORD.LIMIT,
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
