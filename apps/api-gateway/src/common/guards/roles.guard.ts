import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../../../user-service/src/schemas/user.schema";
import { ROLES_KEY } from "../decorators/roles.decorator";

/**
 * RolesGuard is a NestJS guard that implements role-based access control for protected routes in the API Gateway.
 * It uses the Reflector to retrieve the required roles metadata defined by the @Roles decorator on route handlers and checks if the authenticated user has the necessary role to access the route.
 * If the user is not authenticated or does not have the required role, the guard throws a ForbiddenException to prevent access to the route.
 * This guard can be applied to any route or controller that requires role-based access control by using the @UseGuards(RolesGuard) decorator, ensuring that only users with the appropriate roles can access those routes.
 * The canActivate method is the core of the guard, where it retrieves the required roles, checks the user's role, and determines whether to allow access or throw an exception based on the user's authentication and authorization status.
 * The guard allows for flexible access control by supporting multiple roles for a single route, enabling developers to specify which roles are allowed to access specific resources in the API Gateway.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if a request can proceed based on user's role.
   *
   * @param context ExecutionContext of the current request
   * @returns boolean - true if access is allowed, otherwise throws exception
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles from @Roles decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get authenticated user from request
    const { user } = context.switchToHttp().getRequest();

    // If user is missing, throw ForbiddenException
    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Check if user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    // If user does not have the required role, throw ForbiddenException
    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    // User is authorized
    return true;
  }
}
