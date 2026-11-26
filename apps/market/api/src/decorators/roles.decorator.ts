import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types/auth-user';

export const ROLES_KEY = 'roles';

/**
 * Declares which roles may access a route or controller.
 * Only metadata: RolesGuard is what enforces it.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
