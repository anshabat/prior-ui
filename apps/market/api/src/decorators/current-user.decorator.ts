import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser, RequestWithUser } from '../types/auth-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined =>
    context.switchToHttp().getRequest<RequestWithUser>().user,
);
