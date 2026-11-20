import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AppService } from './app.service';

export interface HelloResponse {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloResponse {
    return { message: this.appService.getHello() };
  }

  @Get('auth-hello')
  getAuthHello(@Req() req: Request): HelloResponse {
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

    return { message: 'hello authenticated' };
  }
}
