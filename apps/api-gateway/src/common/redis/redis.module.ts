import { Global, Module } from "@nestjs/common";
import { RedisTokenService } from "./redis-token.service";
import { RedisClientService } from "./redis.client";

/**
 * Redis Module responsible for providing Redis-related services and functionality within the API Gateway.
 * This module encapsulates the RedisService, which manages interactions with the Redis database, such as storing and retrieving authentication tokens.
 * By defining this module, we can easily inject the RedisService into other parts of the application (e.g., authentication strategies) to utilize Redis for caching and token management.
 * The module is marked as global, allowing the RedisService to be available throughout the entire application without needing to import the RedisModule in every module that requires it.
 */
@Global()
@Module({
  /**
   * Providers array includes the RedisService, which is responsible for managing Redis connections and operations. This service can be injected into other services or controllers that require Redis functionality, such as the JwtStrategy for token validation.
   */
  providers: [RedisClientService, RedisTokenService],

  /**
   * Exports array makes the RedisService available for injection in other modules of the application. By exporting the RedisService, we can ensure that any module that imports the RedisModule can access and utilize the RedisService for its operations, facilitating a modular and reusable architecture.
   */
  exports: [RedisClientService, RedisTokenService],
})
export class RedisModule {}
