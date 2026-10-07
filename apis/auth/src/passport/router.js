/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('../../types').UpdatePasswordPayload} UpdatePasswordPayload
 * @typedef {import('../../types').UpdatePasswordResponse} UpdatePasswordResponse
 * @typedef {import('../../types').SignInResponse} SignInResponse
 * @typedef {import('../../types').ResetPasswordPayload} ResetPasswordPayload
 * @typedef {import('../../types').ResetPasswordResponse} ResetPasswordResponse
 * @typedef {import('../../types').RegisterPayload} RegisterPayload
 * @typedef {import('../../types').RegisterResponse} RegisterResponse
 * @typedef {import('../../types').User} User
 */

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  findOrCreateOAuthUser,
  resendVerificationEmail,
} = require("../lib/utils.js");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const { Strategy: LocalStrategy } = require("passport-local");
const { storeOauthReturnUrl } = require("../middlewares");
const { config } = require("@workspace/config");
const { createOAuthCallbackHandler } = require("./utils.js");
const { registerAction } = require("../controllers/registerAction");
const { signInAction } = require("../controllers/signInAction");
const { updatePasswordAction } = require("../controllers/updatePasswordAction");
const { resetPasswordAction } = require("../controllers/resetPasswordAction");
const { verifyEmailAction } = require("../controllers/verifyEmailAction");
const { logoutAction } = require("../controllers/logoutAction");

const { APP_BASE_URL, API_BASE_URL } = config.auth;

// Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET;
const GOOGLE_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback/google`;

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET;
const GITHUB_CALLBACK_URL = `${API_BASE_URL}/api/auth/callback/github`;

const router = express.Router();

router.use(cors({ origin: APP_BASE_URL, credentials: true }));
router.use(/** @type {RequestHandler} */ (passport.initialize()));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
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
        if (!user) {
          return done(new Error("No user found"), false);
        }
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
        if (!user) {
          return done(new Error("No user found"), false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

router.post("/api/register", registerAction);

// Handle browser click, redirects to OAuth login page
router.get(
  "/api/auth/signin/google",
  storeOauthReturnUrl,
  passport.authenticate("google"),
);

// Handle browser click, redirects to GitHub OAuth login page
router.get(
  "/api/auth/signin/github",
  storeOauthReturnUrl,
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

router.post("/api/signin", signInAction);
router.post("/api/logout", logoutAction);
router.post("/api/reset-password", resetPasswordAction);
router.post("/api/update-password", updatePasswordAction);
router.get("/page/verify-email", verifyEmailAction);

module.exports = router;
