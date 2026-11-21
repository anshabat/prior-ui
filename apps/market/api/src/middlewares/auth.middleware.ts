import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { RequestWithUser } from '../types/auth-user';

export class AuthMiddleware implements NestMiddleware {
  use(req: RequestWithUser, _res: Response, next: NextFunction): void {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_SECRET is not set');
    }

    const token: unknown = req.cookies?.authToken;

    if (typeof token === 'string' && token !== '') {
      try {
        const claims = verify(token, secret, {
          algorithms: ['HS256'],
        }) as JwtPayload;
        req.user = {
          id: claims.id,
          email: claims.email,
          name: claims.name,
          image: claims.image,
        };
      } catch {
        // Invalid or expired token: continue as anonymous
      }
    }

    next();
  }
}
