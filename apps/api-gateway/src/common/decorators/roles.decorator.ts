/**
 * @fileoverview Roles decorator for dynamic RBAC.
 *
 * Attaches an array of allowed role **names** (strings) as metadata
 * to a route handler or controller class. The {@link RolesGuard}
 * reads this metadata at runtime to enforce access control.
 *
 * Because roles are stored in MongoDB and can be created or deleted
 * at any time, we accept plain strings rather than a fixed enum.
 */

import { SetMetadata } from "@nestjs/common";

/**
 * Metadata key used to store and retrieve role requirements.
 * Shared between the `@Roles()` decorator and the `RolesGuard`.
 */
export const ROLES_KEY = "roles";

/**
 * Marks a route or controller as accessible only to users whose
 * `role` field matches **at least one** of the supplied role names.
 *
 * @param roles - One or more role name strings (case-insensitive
 *                comparison is done inside the guard).
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
