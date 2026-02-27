/**
 * @fileoverview JWT authentication guard.
 *
 * Protects routes by requiring a valid JWT token in the
 * Authorization header via the Passport "jwt" strategy.
 */

import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // Override the canActivate method to call the parent implementation, which performs the JWT validation and user retrieval logic defined in the JwtStrategy.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
