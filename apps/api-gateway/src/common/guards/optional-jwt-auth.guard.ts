/**
 * @fileoverview Optional JWT authentication guard.
 *
 * Allows a route to be accessed by both authenticated and
 * unauthenticated users. If a valid JWT is present the user object
 * is attached; otherwise `req.user` is `null`.
 */

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  // Override the handleRequest method to allow requests without a valid JWT token to proceed without throwing an unauthorized error.
  handleRequest(err: any, user: any) {
    return user ?? null;
  }
}
