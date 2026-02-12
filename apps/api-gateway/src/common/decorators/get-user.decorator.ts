import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom decorator to extract the authenticated user information from the request object in NestJS controllers.
 * This decorator can be used in controller methods to easily access the user information that has been attached to the request by authentication guards (e.g., JwtAuthGuard).
 * It retrieves the user object from the request and makes it available as a parameter in the controller method, allowing for cleaner and more concise code when handling authenticated requests.
 * The user information typically includes details such as user ID, email, roles, and other relevant data that may be needed for authorization or business logic within the controller.
 */
export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    // Extract the request object from the execution context, which contains the user information attached by the authentication guard.
    const request = ctx.switchToHttp().getRequest();

    // Return the user information from the request object, allowing it to be accessed as a parameter in the controller method where this decorator is used.
    return request.user;
  },
);
