import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../../../user-service/src/schemas/user.schema";

/**
 * Decorator to attach required roles metadata to route handlers.
 */
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
