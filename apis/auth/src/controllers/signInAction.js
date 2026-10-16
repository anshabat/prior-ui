/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').SignInResponse} SignInResponse
 * @typedef {import('../../types').TwoFactorToken} TwoFactorToken
 */

const passport = require("passport");
const { authTokenCookie } = require("../lib/cookies");
const { createCredentialsJWT } = require("../lib/jwt");
const { getSession } = require("../services/getSession");
const {
  verifyTwoFactorCode,
  issueTwoFactorToken,
} = require("../services/twoFactorService");

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
      try {
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
            await verifyTwoFactorCode(user.email, code);
          } else {
            await issueTwoFactorToken(user.email);

            return res
              .status(200)
              .json({ twoFactor: true, session: null, error: null });
          }
        }

        const jwt = createCredentialsJWT(user);
        const session = getSession(jwt);
        authTokenCookie.set(res, jwt);

        return res.status(200).json({
          error: null,
          session,
          twoFactor: false,
        });
      } catch (error) {
        return res.status(500).json({
          error: error instanceof Error ? error.message : "SignInError",
          session: null,
          twoFactor: false,
        });
      }
    },
  )(req, res, next);
}

module.exports = { signInAction };
