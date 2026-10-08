/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').SignInResponse} SignInResponse
 */

const passport = require("passport");
const { generateTwoFactorToken } = require("../lib/utils.js");
const {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} = require("../repository/twoFactorTokenRepository");
const {
  createCredentialsJWT,
  extractSessionFromJWT,
} = require("../lib/jwt");
const { sendTwoFactorTokenEmail } = require("../lib/mail.js");

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
}

module.exports = { signInAction };
