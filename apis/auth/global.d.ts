import { Prisma, PrismaClient } from "@prisma/client";

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

  type RegisterResponse = {
    success: boolean;
    error: string | null;
  };

  type ResetPasswordBody = {
    email: string;
    callbackUrl: string;
  };
  type ResetPasswordResponse = {
    data: boolean;
    error: string | null;
  };

  type UpdatePasswordBody = {
    token: string;
    password: string;
  };
  type UpdatePasswordResponse = {
    data?: boolean;
    error?: string;
  };

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
  RegisterResponse,
  ResetPasswordBody,
  ResetPasswordResponse,
  UpdatePasswordResponse,
};
