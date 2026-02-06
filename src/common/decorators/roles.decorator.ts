import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

/**
 * Decorator to attach required roles metadata to route handlers.
 *
 * Example: `@Roles(UserRole.DIRECTOR, UserRole.HR)`
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
