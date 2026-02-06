import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that optionally authenticates a user using JWT.
 * If a valid JWT is provided, the user is attached to the request;
 * otherwise, the request proceeds without authentication.
 * @class OptionalJwtAuthGuard
 * @extends AuthGuard
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    return user ?? null;
  }
}
