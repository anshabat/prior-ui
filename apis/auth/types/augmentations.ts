import { PrismaClient } from "@prisma/client";

declare module "passport-local" {
  interface IVerifyOptions {
    status?: number;
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
