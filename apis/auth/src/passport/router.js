/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('../../types').UpdatePasswordPayload} UpdatePasswordPayload
 * @typedef {import('../../types').UpdatePasswordResponse} UpdatePasswordResponse
 * @typedef {import('../../types').SignInResponse} SignInResponse
 * @typedef {import('../../types').SignOutResponse} SignOutResponse
 * @typedef {import('../../types').ResetPasswordPayload} ResetPasswordPayload
 * @typedef {import('../../types').ResetPasswordResponse} ResetPasswordResponse
 * @typedef {import('../../types').User} User
 */

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  findOrCreateOAuthUser,
  verifyEmail,
  resendVerificationEmail,
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
  updateUserPasswordByToken,
  generateTwoFactorToken,
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} = require("../lib/utils.js");
const {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
} = require("../lib/mail.js");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const { Strategy: LocalStrategy } = require("passport-local");
const {
  useOauthReturnUrl,
  createOAuthCallbackHandler,
} = require("./middlewares.js");
const { config } = require("@workspace/config");
const { createCredentialsJWT, extractSessionFromJWT } = require("./utils.js");

const { APP_BASE_URL, API_BASE_URL } = config.auth;

// Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET;
const GOOGLE_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback/google`;

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET;
const GITHUB_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback/github`;

const router = express.Router();

router.use(/** @type {RequestHandler} */ (cookieParser()));
router.use(cors({ origin: APP_BASE_URL, credentials: true }));
router.use(/** @type {RequestHandler} */ (passport.initialize()));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use email instead of username
      passwordField: "password",
      session: false, // Keep consistent with your OAuth approach
    },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);

        if (!user) {
          return done(null, false, {
            message: "CredentialsSignin",
            status: 401,
          });
        }

        if (!user.password) {
          return done(null, false, {
            message: "AccountNotLinked",
            status: 403,
          });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return done(null, false, {
            message: "CredentialsSignin",
            status: 401,
          });
        }

        if (!user.emailVerified) {
          await resendVerificationEmail(email);
          return done(null, false, { message: "EmailRequired", status: 403 });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }
        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerAccountId: profile.id,
          name: profile.displayName,
          email: email,
          image: profile.photos?.[0]?.value ?? null,
        });
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    /**
     * @param {string} _accessToken
     * @param {string} _refreshToken
     * @param {import('passport-github2').Profile} profile
     * @param {(err: unknown, user: User | false) => Promise<void>} done
     */
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in GitHub profile"), false);
        }

        const user = await findOrCreateOAuthUser({
          provider: "github",
          providerAccountId: profile.id,
          name: profile.displayName || profile.username || "",
          email: email,
          image: profile.photos?.[0]?.value ?? null,
        });
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

// Handle browser click, redirects to OAuth login page
router.get(
  "/api/auth/signin/google",
  useOauthReturnUrl,
  passport.authenticate("google"),
);

// Handle browser click, redirects to GitHub OAuth login page
router.get(
  "/api/auth/signin/github",
  useOauthReturnUrl,
  passport.authenticate("github"),
);

router.get("/api/auth/callback/google", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    createOAuthCallbackHandler("google")(req, res),
  )(req, res, next);
});

router.get("/api/auth/callback/github", (req, res, next) => {
  passport.authenticate(
    "github",
    { session: false },
    createOAuthCallbackHandler("github")(req, res),
  )(req, res, next);
});

// OAuth error handler
router.get(
  "/api/auth/error",
  /**
   * @param {Request} req
   * @param {Response} res
   */
  (req, res) => {
    const serverRoot = `${req.protocol}://${req.get("host")}`;
    const returnUrl = req.cookies.oauth_return_url || serverRoot;
    res.clearCookie("oauth_return_url");

    res.redirect(`${returnUrl}?error=auth_failed`);
  },
);

router.post(
  "/api/signin",
  /**
   * @param {Request} req
   * @param {import('express').Response<SignInResponse>} res
   */
  (req, res, next) => {
    passport.authenticate(
      "local",
      { session: false },
      /**
       * @param {Error | null} err
       * @param {User} user
       * @param {import('passport-local').IVerifyOptions} info
       * @returns {Promise<Response>}
       */
      async (err, user, info) => {
        if (err) {
          return res.status(500).json({
            error: err?.message || "SignInError",
            session: null,
            twoFactor: false,
          });
        }

        if (!user) {
          const status = info.status || 401;
          const message = info.message || "CredentialsSignin";
          return res
            .status(status)
            .json({ error: message, session: null, twoFactor: false });
        }

        if (user?.isTwoFactorEnabled) {
          const { code } = req.body;

          if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

            if (!twoFactorToken || twoFactorToken.token !== code) {
              return res.status(401).json({
                error: "TwoFactorInvalidCode",
                session: null,
                twoFactor: true,
              });
            }

            if (twoFactorToken.expires < new Date()) {
              return res.status(401).json({
                error: "TwoFactorExpiredCode",
                session: null,
                twoFactor: true,
              });
            }

            const isTokenDeleted = await deleteTwoFactorToken(twoFactorToken);
            if (!isTokenDeleted) {
              return res.status(500).json({
                error: "TwoFactorError",
                session: null,
                twoFactor: true,
              });
            }
          } else {
            const twoFactorToken = await generateTwoFactorToken(user.email);
            await sendTwoFactorTokenEmail(
              twoFactorToken.email,
              twoFactorToken.token,
            );

            return res
              .status(200)
              .json({ twoFactor: true, session: null, error: null });
          }
        }

        const token = createCredentialsJWT(user);
        const session = extractSessionFromJWT(token);

        res.cookie("authToken", token, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          // secure: true, // enable in production (requires HTTPS)
        });

        return res.status(200).json({
          error: null,
          session,
          twoFactor: false,
        });
      },
    )(req, res, next);
  },
);

router.get(
  "/api/session",
  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Response}
   */
  (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ error: "No session found" });
    }

    try {
      const session = extractSessionFromJWT(token);
      return res.status(200).json(session);
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }
  },
);

router.post(
  "/api/logout",
  /**
   * @param {Request} _req
   * @param {import('express').Response<SignOutResponse>} res
   */
  (_req, res) => {
    res.clearCookie("authToken", { path: "/" });
    return res.status(200).json({ data: true, error: null });
  },
);

router.post(
  "/api/reset-password",
  /**
   * @param {import('express').Request<{}, {}, ResetPasswordPayload>} req
   * @param {import('express').Response<ResetPasswordResponse>} res
   */
  async (req, res) => {
    try {
      const { email, callbackUrl } = req.body ?? {};
      const existingUser = await getUserByEmail(email);

      if (!existingUser) {
        return res
          .status(400)
          .json({ success: false, error: "User not found" });
      }

      const passwordResetToken = await generatePasswordResetToken(email);
      if (!passwordResetToken) {
        throw new Error("Failed to request password reset");
      }

      await sendPasswordResetEmail(
        email,
        passwordResetToken.token,
        callbackUrl,
      );

      return res.json({ success: true, data: true });
    } catch (error) {
      console.error("Failed to request password reset", error);
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res
        .status(500)
        .json({ success: false, error: "Failed to request password reset" });
    }
  },
);

router.post(
  "/api/update-password",
  /**
   * @param {import('express').Request<{}, {}, UpdatePasswordPayload>} req
   * @param {import('express').Response<UpdatePasswordResponse>} res
   */
  async (req, res) => {
    try {
      const { token, password } = req.body ?? {};
      const passwordResetToken = await getPasswordResetTokenByToken(token);

      if (!passwordResetToken) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid or expired token" });
      }

      if (passwordResetToken.expires < new Date()) {
        return res.status(400).json({ success: false, error: "Token expired" });
      }

      const user = await getUserByEmail(passwordResetToken.email);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "User not found" });
      }

      await updateUserPasswordByToken(user.id, passwordResetToken.id, password);
      return res.json({ success: true, data: true });
    } catch (error) {
      console.error("Failed to update password", error);
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res
        .status(500)
        .json({ success: false, error: "Failed to update password" });
    }
  },
);

router.get("/page/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    if (typeof token !== "string" || token.length === 0) {
      throw new Error("Invalid token");
    }
    await verifyEmail(token);
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: "Failed to verify email" });
  }
});

module.exports = router;
