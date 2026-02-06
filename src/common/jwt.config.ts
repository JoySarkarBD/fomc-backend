import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Configuration object for JWT authentication in the application.
 * - `secret`: The secret key used to sign JWTs, sourced from environment variables with a default fallback.
 * - `signOptions`: Options for signing JWTs, including the expiration time, also sourced from environment variables with a default fallback.
 * This configuration is used by the JwtModule to set up JWT authentication across the application.
 * @constant jwtConfig
 * @type {JwtModuleOptions}
 */
export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'your-default-jwt-secret',
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  },
};
