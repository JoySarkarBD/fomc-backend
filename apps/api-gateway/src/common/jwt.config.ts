import { JwtModuleOptions } from "@nestjs/jwt";
import config from "../../../config/config";

/**
 * JWT configuration for the API Gateway, defining the secret key and token expiration settings for JWT authentication.
 * The jwtConfig object is used to configure the JwtModule in the AuthModule, allowing the application to generate and validate JWT tokens for user authentication and authorization.
 * The secret key is obtained from the environment variable JWT_SECRET, with a fallback default value for development purposes. The token expiration time is also configurable via the JWT_EXPIRES_IN environment variable, allowing for flexible token management based on the application's requirements.
 * By centralizing the JWT configuration in this file, it promotes better maintainability and separation of concerns, making it easier to manage authentication settings across the API Gateway.
 * This configuration ensures that the application can securely handle JWT tokens, providing a robust authentication mechanism for users accessing protected routes and resources within the API Gateway.
 */
export const jwtConfig: JwtModuleOptions = {
  secret: config.JWT_SECRET || "your-default-jwt-secret",
  signOptions: {
    expiresIn: (config.JWT_EXPIRES_IN || 2592000) as any,
  },
};
