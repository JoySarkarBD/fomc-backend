import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the authenticated user from the request context.
 * Can be used in controllers to easily access the current user.
 * @returns The authenticated user object or null if not authenticated.
 */
export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
