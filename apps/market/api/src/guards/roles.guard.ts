import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser, UserRole } from '../types/auth-user';

const ROLES_KEY = 'roles';

const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  ADMIN: ['USER'],
  USER: [],
};

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // A method's @Roles() overrides the controller's
    const requiredRoles = this.reflector.getAllAndOverride<
      UserRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user) {
      throw new UnauthorizedException();
    }

    // false makes Nest throw ForbiddenException (403)
    const userRoles = resolveRoleHierarchy(user.role);
    return requiredRoles.some((role) => userRoles.has(role));
  }
}

export const Roles = (...roles: UserRole[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));

function resolveRoleHierarchy(role: UserRole): Set<UserRole> {
  const reachable = new Set<UserRole>();
  const toVisit = [role];

  while (toVisit.length > 0) {
    const current = toVisit.pop();
    if (current == undefined || reachable.has(current)) {
      continue;
    }
    reachable.add(current);
    // ?? []: an unknown role claim inherits nothing instead of crashing
    toVisit.push(...(ROLE_HIERARCHY[current] ?? []));
  }

  return reachable;
}
