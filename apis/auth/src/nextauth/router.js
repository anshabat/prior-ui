const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const { ExpressAuth, getSession } = require("@auth/express");
const { skipCSRFCheck } = require("@auth/core");
const { default: GitHub } = require("@auth/express/providers/github");
const { default: Google } = require("@auth/express/providers/google");
const { default: Credentials } = require("@auth/express/providers/credentials");
const { PrismaAdapter } = require("@auth/prisma-adapter");
const db = require("../lib/db.js");
const {
  getUserByEmail,
  getTwoFactorTokenByEmail,
  deleteTwoFactorToken,
  generateTwoFactorToken,
  getUserById,
  verifyEmail,
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
  updateUserPasswordByToken,
} = require("../lib/utils.js");
const {
  sendTwoFactorTokenEmail,
  sendPasswordResetEmail,
} = require("../lib/mail.js");
const { config } = require("@workspace/config");
const { APP_BASE_URL } = config.auth;
const {
  getCallbackUrlFromCookie,
  transformAuthTokenToSessionUser,
} = require("./utils.js");

/** @type {import('@auth/express').ExpressAuthConfig} */
const authConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  skipCSRFCheck,
  pages: {
    signIn: "/api/redirect",
    error: "/api/redirect",
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Password",
        },
        code: {
          type: "text",
          label: "Two-Factor Code",
        },
      },
      authorize: async ({ email, password }) => {
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await getUserByEmail(email);
        if (!user) return null;

        if (!user.password) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, credentials }) {
      if (account?.provider !== "credentials") return true;

      if (!user.email) {
        return `/api/responder/credentials/signIn?error=EmailRequired`;
      }

      if (!user.emailVerified) {
        return `/api/responder/credentials/signIn?error=EmailNotVerified`;
      }

      if (user.isTwoFactorEnabled) {
        const code = credentials?.code;

        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(user.email);
          if (!twoFactorToken || twoFactorToken.token !== code) {
            return `/api/responder/credentials/signIn?error=TwoFactorInvalidCode`;
          }
          if (twoFactorToken.expires < new Date()) {
            console.error("2FA code expired");
            return `/api/responder/credentials/signIn?error=TwoFactorExpiredCode`;
          }

          const isTokenDeleted = await deleteTwoFactorToken(twoFactorToken);
          if (!isTokenDeleted) {
            console.error("Failed to delete 2FA token");
            return `/api/responder/credentials/signIn?error=TwoFactorError`;
          }
        } else {
          const twoFactorToken = await generateTwoFactorToken(user.email);
          await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token,
          );
          return `/api/responder/credentials/twoFactor`;
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url, baseUrl);
      const targetOrigin = parsedUrl.origin;
      const baseOrigin = new URL(baseUrl).origin;
      const isTargetUrlRelative = url.startsWith("/") && !url.startsWith("//");

      if (
        targetOrigin === APP_BASE_URL ||
        targetOrigin === baseOrigin ||
        isTargetUrlRelative
      ) {
        return url;
      }

      return baseUrl;
    },
    async jwt({ token, account }) {
      const userId = token.sub;
      if (!userId) return token;

      const existingUser = await getUserById(userId);
      if (!existingUser) return token;

      token.role = existingUser.role;
      if (account?.provider) {
        token.provider = account?.provider;
      }

      return token;
    },
    async session({ session, token }) {
      const authSession = /** @type {AuthSession} */ (session);
      authSession.user = transformAuthTokenToSessionUser(token);
      return authSession;
    },
  },
};

const router = express.Router();
router.use(cors({ origin: APP_BASE_URL, credentials: true }));

router.use("/api/auth/*", ExpressAuth(authConfig));

router.get("/api/redirect", (req, res) => {
  const origin = `${req.protocol}://${req.get("host")}`;

  const callbackUrl = getCallbackUrlFromCookie(req.headers.cookie);
  const refererUrl = req.headers.referer;
  const redirectBase = callbackUrl || refererUrl || origin;

  const url = new URL(req.originalUrl, origin);
  const qs = url.search;
  const error = new URLSearchParams(qs).get("error");
  if (error) {
    return res.redirect(302, `${redirectBase}${qs}`);
  }

  return res.redirect(302, `${redirectBase}${qs}`);
});

router.get(
  "/api/responder/credentials/signIn",
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response<SignInResponse>} res
   */
  async (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    const url = new URL(req.originalUrl, origin);
    const qsParams = new URLSearchParams(url.search);

    const error = qsParams.get("error");
    if (error) {
      return res.status(401).json({ error, session: null, twoFactor: false });
    }

    const session = await getSession(req, authConfig);
    if (!session) {
      return res
        .status(401)
        .json({ error: "SessionTokenError", session: null, twoFactor: false });
    }

    res.status(200).json({
      error: null,
      session,
      twoFactor: false,
    });
  },
);

router.get(
  "/api/responder/credentials/twoFactor",
  /**
   * @param {import('express').Request} _req
   * @param {import('express').Response<SignInResponse>} res
   */
  (_req, res) => {
    return res
      .status(200)
      .json({ error: null, session: null, twoFactor: true });
  },
);

router.get(
  "/api/responder/credentials/signOut",
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response<SignOutResponse>} res
   */
  async (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    const url = new URL(req.originalUrl, origin);
    const qsParams = new URLSearchParams(url.search);

    const error = qsParams.get("error");
    if (error) {
      return res.status(401).json({ error });
    }

    const session = await getSession(req, authConfig);
    if (session) {
      return res.status(401).json({ error: "SignOutError" });
    }

    res.status(200).json({ data: true });
  },
);

router.get("/page/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    if (typeof token !== "string") {
      throw new Error("Invalid token");
    }
    await verifyEmail(token);
    return res.status(200).json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Verification failed";
    return res.status(400).json({ error: msg });
  }
});

router.post(
  "/api/reset-password",
  /**
   * @param {import('express').Request<{}, {}, ResetPasswordBody>} req
   * @param {import('express').Response<ResetPasswordResponse>} res
   */
  async (req, res) => {
    try {
      const { email, callbackUrl } = req.body ?? {};

      const existingUser = await getUserByEmail(email);

      if (!existingUser) {
        return res.status(400).json({ data: false, error: "User not found" });
      }

      const passwordResetToken = await generatePasswordResetToken(email);
      if (!passwordResetToken) {
        throw new Error("PasswordResetTokenGenerationFailed");
      }

      await sendPasswordResetEmail(
        email,
        passwordResetToken.token,
        callbackUrl,
      );

      return res.json({
        data: true,
        error: null,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "PasswordResetFailed";
      return res.status(500).json({ data: false, error: msg });
    }
  },
);

router.post(
  "/api/update-password",
  /**
   * @param {import('express').Request<{}, {}, UpdatePasswordBody>} req
   * @param {import('express').Response<UpdatePasswordResponse>} res
   */
  async (req, res) => {
    try {
      const { token, password } = req.body ?? {};

      const passwordResetToken = await getPasswordResetTokenByToken(token);
      if (!passwordResetToken) {
        return res.status(400).json({ error: "InvalidOrExpiredToken" });
      }

      if (passwordResetToken.expires < new Date()) {
        return res.status(400).json({ error: "TokenExpired" });
      }

      const user = await getUserByEmail(passwordResetToken.email);
      if (!user) {
        return res.status(400).json({ error: "UserNotFound" });
      }

      try {
        await updateUserPasswordByToken(
          user.id,
          passwordResetToken.id,
          password,
        );
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : "UpdatePasswordFailed";
        return res.status(500).json({ error: msg });
      }

      return res.json({ data: true });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "UpdatePasswordFailed";
      return res.status(500).json({ error: msg });
    }
  },
);

module.exports = router;
