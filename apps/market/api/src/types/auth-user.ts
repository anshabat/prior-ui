import { Request } from 'express';

/** Mirrors the UserRole enum in apis/auth/prisma/schema.prisma. */
export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user?: AuthUser;
}
