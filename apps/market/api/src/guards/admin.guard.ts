import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from '../types/auth-user';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    return true;
  }
}
