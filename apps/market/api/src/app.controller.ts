import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { AuthUser } from './types/auth-user';

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
  getAuthHello(@CurrentUser() user: AuthUser | undefined): HelloResponse {
    return { message: `hello authenticated, ${user?.name ?? user?.email}` };
  }

  @Get('admin-hello')
  @UseGuards(AdminGuard)
  getAdminHello(@CurrentUser() user: AuthUser | undefined): HelloResponse {
    return { message: `hello admin, ${user?.name ?? user?.email}` };
  }
}
