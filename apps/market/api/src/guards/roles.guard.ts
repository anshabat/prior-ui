import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser, UserRole } from '../types/auth-user';

const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  ADMIN: ['USER'],
  USER: [],
};

/**
 * Allows the request when the user has, or inherits, one of the roles
 * from @Roles(). Answers 401 when nobody is signed in, 403 otherwise.
 */
@Injectable()
export class RolesGuard implements CanActivate {
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
    const userRoles = getReachableRoles(user.role);
    return requiredRoles.some((role) => userRoles.has(role));
  }
}

function getReachableRoles(role: UserRole): Set<UserRole> {
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
