import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard, AuthUser } from './guards/auth.guard';

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
  @UseGuards(AuthGuard)
  getAuthHello(@CurrentUser() user: AuthUser): HelloResponse {
    return { message: `hello authenticated, ${user.name ?? user.email}` };
  }
}
