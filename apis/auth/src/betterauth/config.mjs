import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, lastLoginMethod } from "better-auth/plugins";
import { config } from "@workspace/config";
import db from "../lib/db.js";
import {
  comparePasswordHash,
  generatePasswordHash,
} from "../lib/utils.js";
import { toAuthSession } from "./session.mjs";

/**
 * @typedef {import('../../types').AuthSession} AuthSession
 * @typedef {import("./session.mjs").BetterAuthSessionUser} BetterAuthSessionUser
 * @typedef {import("better-auth").Session} BetterAuthSession
 */

const { API_BASE_URL, APP_BASE_URL, CLIENT_APPS_URLS } = config.auth;

export const auth = betterAuth({
  // Persist users/sessions/accounts through the existing Prisma client.
  database: prismaAdapter(db, { provider: "postgresql" }),
  // Sign cookies and tokens with the same secret as passport/nextauth.
  secret: process.env.AUTH_SECRET,
  // Public origin of this API; used to build callback and verify URLs.
  baseURL: API_BASE_URL,
  // Browser origins allowed to send credentials (auth app + demo apps).
  trustedOrigins: [APP_BASE_URL, ...CLIENT_APPS_URLS],
  emailAndPassword: {
    enabled: true,
    // Demo RegisterForm uses short passwords like "123".
    minPasswordLength: 3,
    // Default hasher is scrypt; reuse passport/nextauth bcrypt helpers.
    password: {
      hash: generatePasswordHash,
      verify: ({ hash, password }) => comparePasswordHash(password, hash),
    },
  },
  plugins: [
    lastLoginMethod({ storeInDatabase: true }),
    customSession(
      /**
       * Logged-in `GET /api/auth/get-session` body. Logged-out stays `null`
       * (Better Auth skips this callback when there is no session).
       *
       * @param {{ user: BetterAuthSessionUser, session: BetterAuthSession }} data
       * @returns {Promise<AuthSession>}
       */
      async ({ user, session }, ctx) => {
        const accounts = await ctx.context.internalAdapter.findAccounts(
          user.id,
        );
        const mapped = toAuthSession({ user, session, accounts });
        if (!mapped) {
          throw new Error("Better Auth session is missing user or expiry");
        }
        return mapped;
      },
    ),
  ],
  advanced: {
    database: {
      // Let Prisma cuid() assign ids so they match existing User rows.
      generateId: false,
    },
  },
  user: {
    // Prisma client accessor (prisma.user), not the SQL table name.
    modelName: "user",
    fields: {
      // Better Auth's boolean emailVerified lives in emailVerifiedBool.
      // User.emailVerified stays DateTime for Auth.js/passport.
      emailVerified: "emailVerifiedBool",
    },
    additionalFields: {
      // Extra User columns Better Auth should load onto the session user.
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // clients cannot set this on sign-up
      },
      isTwoFactorEnabled: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  session: {
    // Prisma Session model; no column mapping needed.
    modelName: "session",
  },
  account: {
    // Shared Account table with Auth.js (not a separate BetterAuthAccount).
    modelName: "account",
    fields: {
      // Better Auth name -> existing Prisma column
      providerId: "provider",
      accountId: "providerAccountId",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      // Do not map accessTokenExpiresAt -> expires_at (DateTime vs Int).
    },
  },
});
