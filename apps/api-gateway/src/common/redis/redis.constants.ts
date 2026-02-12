/**
 * This file defines constants used for Redis operations in the API Gateway, specifically for handling authentication tokens. The `REDIS_TOKEN_PREFIX` constant is used as a prefix for storing JWT tokens in Redis, ensuring that all token-related entries are easily identifiable and organized within the Redis database. By using a consistent prefix, we can efficiently manage and retrieve tokens, as well as implement token expiration and cleanup strategies. This constant is utilized by the `RedisTokenService` when storing, retrieving, and deleting tokens in Redis, providing a clear namespace for authentication-related data.
 */
export const REDIS_TOKEN_PREFIX = "auth:token:";
