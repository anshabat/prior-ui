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
const { storeOauthReturnUrl } = require("../middlewares/storeOauthReturnUrl");
const { config } = require("@workspace/config");
const { asyncErrorHandler } = require("../lib/error");
const { registerAction } = require("../controllers/registerAction");
const {
  createOauthCallbackAction,
} = require("../controllers/createOauthCallbackAction");
const { signInAction } = require("../controllers/signInAction");
const { updatePasswordAction } = require("../controllers/updatePasswordAction");
const { resetPasswordAction } = require("../controllers/resetPasswordAction");
const { verifyEmailAction } = require("../controllers/verifyEmailAction");
const { logoutAction } = require("../controllers/logoutAction");
const { localStrategy } = require("../strategies/local-strategy");
const { googleStrategy } = require("../strategies/google-strategy");
const { githubStrategy } = require("../strategies/github-strategy");

const { APP_BASE_URL } = config.auth;

const router = express.Router();
router.use(cors({ origin: APP_BASE_URL, credentials: true }));
router.use(passport.initialize());

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);

router.post("/api/register", asyncErrorHandler(registerAction));
router.get(
  "/api/auth/signin/google",
  storeOauthReturnUrl,
  passport.authenticate("google"),
);
router.get(
  "/api/auth/signin/github",
  storeOauthReturnUrl,
  passport.authenticate("github"),
);
router.get(
  "/api/auth/callback/google",
  asyncErrorHandler(createOauthCallbackAction("google")),
);
router.get(
  "/api/auth/callback/github",
  asyncErrorHandler(createOauthCallbackAction("github")),
);
router.post("/api/signin", asyncErrorHandler(signInAction));
router.post("/api/logout", asyncErrorHandler(logoutAction));
router.post("/api/reset-password", asyncErrorHandler(resetPasswordAction));
router.post("/api/update-password", asyncErrorHandler(updatePasswordAction));
router.get("/page/verify-email", asyncErrorHandler(verifyEmailAction));

module.exports = router;
