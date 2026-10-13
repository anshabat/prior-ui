/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').SignInResponse} SignInResponse
 * @typedef {import('../../types').TwoFactorToken} TwoFactorToken
 */

const { randomInt } = require("node:crypto");
const passport = require("passport");
const {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
  createTwoFactorToken,
} = require("../repository/twoFactorTokenRepository");
const { createCredentialsJWT } = require("../lib/jwt");
const { sendTwoFactorTokenEmail } = require("../lib/mail.js");
const { getSession } = require("../services/getSession");

/**
 * @param {string} email
 * @returns {Promise<TwoFactorToken>}
 */
const generateTwoFactorToken = async (email) => {
  const token = randomInt(100_000, 1_000_000).toString(); // 6 digit code
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    const isTokenDeleted = await deleteTwoFactorToken(existingToken);
    if (!isTokenDeleted) {
      throw new Error("Failed to delete two factor token");
    }
  }

  const twoFactorToken = await createTwoFactorToken({
    email,
    token,
    expires,
  });
  if (!twoFactorToken) {
    throw new Error("Failed to create two factor token");
  }

  return twoFactorToken;
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response<SignInResponse>} res
 * @param {import('express').NextFunction} next
 */
async function signInAction(req, res, next) {
  passport.authenticate(
    "local",
    { session: false },
    /**
     * @param {Error | null} err
     * @param {User} user
     * @param {import('passport-local').IVerifyOptions} info
     * @returns {Promise<import('express').Response>}
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

      let session;
      try {
        session = getSession(token);
      } catch (error) {
        return res.status(500).json({
          error: error instanceof Error ? error.message : "SignInError",
          session: null,
          twoFactor: false,
        });
      }

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
}

module.exports = { signInAction };
