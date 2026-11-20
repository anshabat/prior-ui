import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token: unknown = req.cookies?.authToken;

    if (typeof token !== 'string' || token === '') {
      throw new UnauthorizedException();
    }

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_SECRET is not set');
    }

    let claims: JwtPayload;
    try {
      claims = verify(token, secret, { algorithms: ['HS256'] }) as JwtPayload;
    } catch {
      throw new UnauthorizedException();
    }

    req.user = {
      id: claims.id,
      email: claims.email,
      name: claims.name,
      image: claims.image,
    };

    return true;
  }
}
