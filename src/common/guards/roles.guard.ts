import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard to enforce role-based access control.
 * Checks if the user has the required roles to access a resource.
 * @class RolesGuard
 * @extends CanActivate
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Override the canActivate method to implement role checking logic
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request context
    const { user } = context.switchToHttp().getRequest();

    // If the user is not authenticated, deny access
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user's role matches any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    // If the user does not have the required role, deny access
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
