import dotenv from "dotenv";

dotenv.config();

interface Config {
  // The port on which the API Gateway will listen for incoming HTTP requests.
  PORT: number;
  USER_SERVICE_HOST: string;
  USER_SERVICE_PORT: number;
  WORKFORCE_SERVICE_HOST: string;
  WORKFORCE_SERVICE_PORT: number;

  // The expiration time for JWT tokens, specified in seconds, which determines how long a generated JWT token will be valid before it expires and requires renewal.
  JWT_EXPIRES_IN: number;
  JWT_SECRET: string;

  // The number of salt rounds to use for bcrypt hashing, which determines the computational cost of hashing passwords. A higher number of salt rounds increases security but also increases the time required to hash passwords, so it should be set to a value that balances security and performance.
  BCRYPT_SALT_ROUNDS: number;

  // The time-to-live (TTL) for rate limiting, specified in seconds, which defines the duration for which a rate limit will be applied to a client after they exceed the allowed number of requests.
  RATE_LIMIT_TTL: number;
  RATE_LIMIT_LIMIT: number;

  // Configuration settings for the email service, including the host, port, user credentials, and the name that will appear as the sender in outgoing emails. These settings are essential for enabling the API Gateway to send emails for functionalities such as password resets, account verification, and other notifications.
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM_NAME: string;
  MAIL_FROM_EMAIL: string;

  // The connection URI for MongoDB, which is used by the API Gateway to connect to the MongoDB database for storing and retrieving data related to users, authentication, and other application functionalities.
  MONGO_URI: string;

  // Configuration settings for connecting to a Redis instance, including the host, port, password, and database index. These settings are crucial for enabling the API Gateway to utilize Redis for caching, session management, rate limiting, and other functionalities that require fast in-memory data storage and retrieval.
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB_SESSION: number;
  REDIS_DB_AUTH: number;
}

const config: Config = {
  // The port on which the API Gateway will listen for incoming HTTP requests, allowing clients to connect to the API Gateway and access its functionalities.
  PORT: parseInt(process.env.PORT as string, 10),
  USER_SERVICE_HOST: process.env.USER_SERVICE_HOST as string,
  USER_SERVICE_PORT: parseInt(process.env.USER_SERVICE_PORT as string, 10),
  WORKFORCE_SERVICE_HOST: process.env.WORKFORCE_SERVICE_HOST as string,
  WORKFORCE_SERVICE_PORT: parseInt(
    process.env.WORKFORCE_SERVICE_PORT as string,
    10,
  ),

  // The expiration time for JWT tokens, specified in seconds, which determines how long a generated JWT token will be valid before it expires and requires renewal. This setting is crucial for maintaining security while providing a reasonable duration for user sessions.
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN as string, 10),
  JWT_SECRET: process.env.JWT_SECRET as string,

  // The number of salt rounds to use for bcrypt hashing, which determines the computational cost of hashing passwords. A higher number of salt rounds increases security but also increases the time required to hash passwords, so it should be set to a value that balances security and performance.
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10),

  // The time-to-live (TTL) for rate limiting, specified in seconds, which defines the duration for which a rate limit will be applied to a client after they exceed the allowed number of requests. This helps to mitigate abuse and ensure fair usage of the API Gateway's resources.
  RATE_LIMIT_TTL: parseInt(process.env.RATE_LIMIT_TTL as string, 10),
  RATE_LIMIT_LIMIT: parseInt(process.env.RATE_LIMIT_LIMIT as string, 10),

  // Configuration settings for the email service, including the host, port, user credentials, and the name that will appear as the sender in outgoing emails. These settings are essential for enabling the API Gateway to send emails for functionalities such as password resets, account verification, and other notifications.
  MAIL_HOST: process.env.MAIL_HOST as string,
  MAIL_PORT: parseInt(process.env.MAIL_PORT as string, 10),
  MAIL_USER: process.env.MAIL_USER as string,
  MAIL_PASS: process.env.MAIL_PASS as string,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME as string,
  MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL as string,

  // The connection URI for MongoDB, which is used by the API Gateway to connect to the MongoDB database for storing and retrieving data related to users, authentication, and other application functionalities.
  MONGO_URI: process.env.MONGO_URI as string,

  // Configuration settings for connecting to a Redis instance, including the host, port, password, and database index. These settings are crucial for enabling the API Gateway to utilize Redis for caching, session management, rate limiting, and other functionalities that require fast in-memory data storage and retrieval.
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: parseInt(process.env.REDIS_PORT as string, 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  REDIS_DB_SESSION: parseInt(process.env.REDIS_DB_SESSION as string, 10),
  REDIS_DB_AUTH: parseInt(process.env.REDIS_DB_AUTH as string, 10),
};

export default config;
