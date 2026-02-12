import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * JWT Authentication Guard for protecting routes that require authentication in the API Gateway.
 * This guard extends the AuthGuard provided by the @nestjs/passport package, using the "jwt" strategy defined in the JwtStrategy.
 * The canActivate method is overridden to call the parent implementation, which handles the JWT validation and user retrieval logic defined in the JwtStrategy.
 * When a request is made to a protected route, this guard will automatically validate the JWT token included in the Authorization header of the request.
 * If the token is valid and corresponds to an authenticated user, the request will proceed; otherwise, an unauthorized error will be returned.
 * This guard can be applied to any route or controller that requires authentication by using the @UseGuards(JwtAuthGuard) decorator, ensuring that only authenticated users can access those routes.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // Override the canActivate method to call the parent implementation, which performs the JWT validation and user retrieval logic defined in the JwtStrategy.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
