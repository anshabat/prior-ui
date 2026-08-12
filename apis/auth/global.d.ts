import { Prisma, PrismaClient } from "@prisma/client";

type ResponseData<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

declare module "passport-local" {
  interface IVerifyOptions {
    status?: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: SessionUser["role"];
    provider: SessionUser["provider"];
  }
}

declare module "@auth/express" {
  interface User extends Prisma.UserGetPayload<{}> {}
  interface Session {
    user: SessionUser;
    expires: string;
  }
}

declare global {
  var prisma: PrismaClient;

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      AUTH_SECRET: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
      AUTH_GITHUB_ID: string;
      AUTH_GITHUB_SECRET: string;
      RESEND_API_KEY: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }

  type SessionUser = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
    provider: string | null;
  };

  type AuthSession = {
    user: SessionUser;
    expires: string;
  };

  type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };

  type User = Prisma.UserGetPayload<{}>;
  type TwoFactorToken = Prisma.TwoFactorTokenGetPayload<{}>;
  type VerificationToken = Prisma.VerificationTokenGetPayload<{}>;
  type PasswordResetToken = Prisma.PasswordResetTokenGetPayload<{}>;

  type SignInResponse = {
    twoFactor: boolean;
    error: string | null;
    session: AuthSession | null;
  };

  type ProvidersResponse = Record<string, Provider>;

  type RegisterPayload = {
    email: string;
    password: string;
  };

  type RegisterResponse = {
    data: boolean;
    error: string | null;
  };

  type ResetPasswordPayload = {
    email: string;
    callbackUrl: string;
  };
  type ResetPasswordResponse = ResponseData<boolean, string>;

  type UpdatePasswordPayload = {
    token: string;
    password: string;
  };
  type UpdatePasswordResponse = ResponseData<boolean, string>;

  type SignOutResponse = {
    data: boolean;
    error: string | null;
  };
}

export {
  AuthSession,
  SignInResponse,
  SignOutResponse,
  Provider,
  ProvidersResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
};
