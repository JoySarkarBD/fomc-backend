import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../../../user-service/src/schemas/user.schema";

/**
 * Decorator to attach required roles metadata to route handlers.
 * This decorator can be used in NestJS controllers to specify which user roles are allowed to access a particular route.
 * It uses the SetMetadata function to associate the specified roles with the route handler, which can then be accessed by guards (e.g., RolesGuard) to enforce role-based access control.
 * The ROLES_KEY constant is used as the key for storing the roles metadata, and the Roles function accepts a variable number of UserRole arguments to define the allowed roles for the route.
 */
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
