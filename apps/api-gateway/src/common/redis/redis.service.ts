import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly tokenPrefix = "auth:token:";

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? "127.0.0.1",
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : undefined,
    });
  }

  async storeToken(tokenId: string, token: string, ttlSeconds: number) {
    const key = this.tokenPrefix + tokenId;
    await this.client.set(key, token, "EX", ttlSeconds);
  }

  async getToken(tokenId: string) {
    const key = this.tokenPrefix + tokenId;
    return this.client.get(key);
  }

  async deleteToken(tokenId: string) {
    const key = this.tokenPrefix + tokenId;
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
