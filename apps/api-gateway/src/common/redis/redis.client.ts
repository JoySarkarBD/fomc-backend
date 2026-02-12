import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import config from "../../../../config/config";

/**
 * RedisClientService is responsible for managing the connection to the Redis database. It initializes a Redis client using the ioredis library with configuration parameters such as host, port, password, and database index. The service provides a method `getClient` to access the Redis client instance for performing Redis operations (e.g., storing and retrieving tokens). Additionally, it implements the `OnModuleDestroy` lifecycle hook to ensure that the Redis connection is properly closed when the module is destroyed, preventing potential memory leaks and ensuring graceful shutdown of the application.
 */
@Injectable()
export class RedisClientService implements OnModuleDestroy {
  private readonly client: Redis;

  /**
   * Constructor initializes the Redis client with the specified configuration parameters. It uses environment variables or default values to set the host, port, password, and database index for the Redis connection. This allows for flexible configuration of the Redis client based on different deployment environments (e.g., development, staging, production) without hardcoding sensitive information in the codebase. The initialized Redis client is stored as a private property of the service for use in other methods that require access to Redis operations.
   */
  constructor() {
    this.client = new Redis({
      host: config.REDIS_HOST ?? "127.0.0.1",
      port: Number(config.REDIS_PORT ?? 6379),
      password: config.REDIS_PASSWORD || undefined,
      db: config.REDIS_DB ? Number(config.REDIS_DB) : undefined,
    });
  }

  /**
   * getClient method provides access to the Redis client instance for performing Redis operations. This method can be used by other services or controllers that require interaction with the Redis database, such as storing and retrieving authentication tokens. By encapsulating the Redis client within this service, we can centralize Redis-related functionality and ensure that all interactions with Redis are managed through a consistent interface, promoting code maintainability and separation of concerns within the application.
   */
  getClient() {
    return this.client;
  }

  /**
   * onModuleDestroy lifecycle hook is implemented to ensure that the Redis connection is properly closed when the module is destroyed. This method is called automatically by NestJS when the application is shutting down or when the module is being unloaded. By calling `this.client.quit()`, we can gracefully close the Redis connection, preventing potential memory leaks and ensuring that all pending Redis commands are completed before the application exits. This is an important aspect of resource management in applications that maintain persistent connections to external services like Redis.
   */
  async onModuleDestroy() {
    await this.client.quit();
  }
}
