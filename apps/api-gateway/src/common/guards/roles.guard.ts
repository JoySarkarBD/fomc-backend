/**
 * @fileoverview Dynamic Roles Guard — RBAC enforcement.
 *
 * Works with the `@Roles()` decorator to enforce role-based access
 * control. Reads the role names set via `@Roles('DIRECTOR', 'HR', ...)`
 * metadata and compares them against `request.user.role` (a string
 * resolved by the JWT strategy from the database).
 *
 * Behaviour:
 * - Merges metadata from **both** the handler and the class level
 *   (handler-level `@Roles()` overrides class-level if both are set).
 * - If **no** `@Roles()` metadata is present, the route is public
 *   (guard allows access).
 * - Comparison is **case-insensitive** so `@Roles('director')` matches
 *   a database role stored as `"DIRECTOR"`.
 * - Throws `ForbiddenException` with a descriptive message when
 *   the user is missing or does not hold an allowed role.
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthUser } from "@shared/interfaces/auth-user.interface";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  /**
   * Determines whether the current request is allowed to proceed
   * based on the authenticated user's role.
   *
   * @param context - ExecutionContext of the current request.
   * @returns `true` if access is granted.
   * @throws {ForbiddenException} if the user is absent or the role is not allowed.
   */
  canActivate(context: ExecutionContext): boolean {
    // ── 1. Retrieve required roles from @Roles() metadata ──────────
    //    `getAllAndOverride` checks the handler first, then falls back
    //    to the class. This lets you set a default at the controller
    //    level and override per-route when needed.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Roles() on this route → open access (no restriction).
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // ── 2. Extract authenticated user from the request ─────────────
    const request = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = request.user;

    if (!user) {
      this.logger.warn(
        `Access denied — no authenticated user on ${request.method} ${request.url}`,
      );
      throw new ForbiddenException("User not authenticated");
    }

    // ── 3. Ensure the user has a role assigned ─────────────────────
    if (!user.role) {
      this.logger.warn(
        `Access denied — user ${user._id ?? user.id} has no role assigned`,
      );
      throw new ForbiddenException(
        "Your account does not have a role assigned. Contact an administrator.",
      );
    }

    // ── 4. Case-insensitive role comparison ────────────────────────
    const userRole = user.role.toUpperCase();
    const normalizedRequired = requiredRoles.map((r) => r.toUpperCase());
    const hasRole = normalizedRequired.includes(userRole);

    if (!hasRole) {
      this.logger.warn(
        `Access denied — user ${user._id ?? user.id} (role: ${user.role}) ` +
          `attempted ${request.method} ${request.url}. ` +
          `Required: [${requiredRoles.join(", ")}]`,
      );
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    // ── 5. Access granted ──────────────────────────────────────────
    this.logger.debug(
      `Access granted — user ${user._id ?? user.id} (role: ${user.role}) ` +
        `on ${request.method} ${request.url}`,
    );
    return true;
  }
}
