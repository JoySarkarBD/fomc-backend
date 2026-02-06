import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that authenticates a user using JWT.
 * Ensures that only requests with valid JWTs can access protected resources.
 * @class JwtAuthGuard
 * @extends AuthGuard
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
