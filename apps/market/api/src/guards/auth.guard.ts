import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token: unknown = req.cookies?.authToken;

    if (typeof token !== 'string' || token === '') {
      throw new UnauthorizedException();
    }

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_SECRET is not set');
    }

    try {
      verify(token, secret, { algorithms: ['HS256'] });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
