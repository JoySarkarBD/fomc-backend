import { Injectable } from "@nestjs/common";
import { RedisClientService } from "./redis.client";
import { REDIS_TOKEN_PREFIX } from "./redis.constants";

@Injectable()
export class RedisTokenService {
  constructor(private readonly redisClient: RedisClientService) {}

  async storeToken(tokenId: string, token: string, ttlSeconds: number) {
    const key = REDIS_TOKEN_PREFIX + tokenId;
    await this.redisClient.getClient().set(key, token, "EX", ttlSeconds);
  }

  async getToken(tokenId: string) {
    const key = REDIS_TOKEN_PREFIX + tokenId;
    return this.redisClient.getClient().get(key);
  }

  async deleteToken(tokenId: string) {
    const key = REDIS_TOKEN_PREFIX + tokenId;
    await this.redisClient.getClient().del(key);
  }
}
