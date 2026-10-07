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
 */

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const { storeOauthReturnUrl } = require("../middlewares");
const { config } = require("@workspace/config");
const { createOAuthCallbackHandler } = require("./utils.js");
const { registerAction } = require("../controllers/registerAction");
const { signInAction } = require("../controllers/signInAction");
const { updatePasswordAction } = require("../controllers/updatePasswordAction");
const { resetPasswordAction } = require("../controllers/resetPasswordAction");
const { verifyEmailAction } = require("../controllers/verifyEmailAction");
const { logoutAction } = require("../controllers/logoutAction");
const { localStrategy } = require("../config/local-strategy");
const { googleStrategy } = require("../config/google-strategy");
const { githubStrategy } = require("../config/github-strategy");

const { APP_BASE_URL } = config.auth;

const router = express.Router();
router.use(cors({ origin: APP_BASE_URL, credentials: true }));
router.use((passport.initialize()));

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);

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
