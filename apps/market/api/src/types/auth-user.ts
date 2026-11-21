import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export interface RequestWithUser extends Request {
  user?: AuthUser;
}
