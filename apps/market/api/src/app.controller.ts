import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
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
  @UseGuards(RolesGuard)
  @Roles('USER')
  getAuthHello(@CurrentUser() user: AuthUser | undefined): HelloResponse {
    return { message: `hello authenticated, ${user?.name ?? user?.email}` };
  }

  @Get('admin-hello')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAdminHello(@CurrentUser() user: AuthUser | undefined): HelloResponse {
    return { message: `hello admin, ${user?.name ?? user?.email}` };
  }
}
