import { Prisma, PrismaClient } from "@prisma/client";
import type { SessionUser } from "./session";

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
}
