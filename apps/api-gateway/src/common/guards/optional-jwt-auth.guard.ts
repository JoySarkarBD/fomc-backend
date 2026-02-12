import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Optional JWT Authentication Guard for routes that can be accessed by both authenticated and unauthenticated users in the API Gateway.
 * This guard extends the AuthGuard provided by the @nestjs/passport package, using the "jwt" strategy defined in the JwtStrategy.
 * The handleRequest method is overridden to allow requests without a valid JWT token to proceed without throwing an unauthorized error.
 * If a valid JWT token is present, the user information will be attached to the request object; if not, the request will still be processed, but the user will be null.
 * This guard can be applied to routes that should be accessible to both authenticated and unauthenticated users by using the @UseGuards(OptionalJwtAuthGuard) decorator, allowing for flexible access control based on the presence of a JWT token.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  // Override the handleRequest method to allow requests without a valid JWT token to proceed without throwing an unauthorized error.
  handleRequest(err: any, user: any) {
    return user ?? null;
  }
}
