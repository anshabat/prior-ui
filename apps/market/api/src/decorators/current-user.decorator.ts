import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser, RequestWithUser } from '../types/auth-user';

/**
 * The user set by AuthMiddleware, or undefined for anonymous requests.
 * Works on any route; on routes behind AuthGuard it is always set.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined =>
    context.switchToHttp().getRequest<RequestWithUser>().user,
);
