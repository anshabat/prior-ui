/**
 * @typedef {import('../../types').SignInResponse} SignInResponse
 */

const { authTokenCookie } = require("../lib/cookies");
const { HttpError } = require("../lib/error");
const { authenticateLocal } = require("../lib/passport");
const { resolveSignIn } = require("../services/signInService");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response<SignInResponse>} res
 * @param {import('express').NextFunction} next
 */
async function signInAction(req, res, next) {
  try {
    const { code } = req.body;

    const { user, info, err } = await authenticateLocal(req, res, next);

    const { session, twoFactor, jwt } = await resolveSignIn({
      user,
      info,
      err,
      code,
    });

    if (jwt) {
      authTokenCookie.set(res, jwt);
    }

    return res.status(200).json({
      error: null,
      session,
      twoFactor,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        error: error.code,
        session: null,
        twoFactor: false,
      });
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : "SignInError",
      session: null,
      twoFactor: false,
    });
  }
}

module.exports = { signInAction };
