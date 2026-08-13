import type { SessionUser } from "./session";

type ResponseData<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type UpdatePasswordPayload = {
  token: string;
  password: string;
};
export type UpdatePasswordResponse = ResponseData<boolean, string>;

export type SignInResponse = {
  twoFactor: boolean;
  error: string | null;
  session: AuthSession | null;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  data: boolean;
  error: string | null;
};

export type ResetPasswordPayload = {
  email: string;
  callbackUrl: string;
};
export type ResetPasswordResponse = ResponseData<boolean, string>;

export type SignOutResponse = {
  data: boolean;
  error: string | null;
};

export type AuthSession = {
  user: SessionUser;
  expires: string;
};

export type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

export type ProvidersResponse = Record<string, Provider>;
