import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import config from "../../../../config/config";

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: config.REDIS_HOST ?? "127.0.0.1",
      port: Number(config.REDIS_PORT ?? 6379),
      password: config.REDIS_PASSWORD || undefined,
      db: config.REDIS_DB ? Number(config.REDIS_DB) : undefined,
    });
  }

  getClient() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
