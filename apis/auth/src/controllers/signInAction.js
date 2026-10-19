/**
 * @typedef {import('../../types').SignInResponse} SignInResponse
 */

const { authTokenCookie } = require("../lib/cookies");
const { authenticateLocal } = require("../lib/passport");
const { resolveSignIn } = require("../services/signInService");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response<SignInResponse>} res
 * @param {import('express').NextFunction} next
 */
async function signInAction(req, res, next) {
  const { code } = req.body;

  // calls strategies/local-strategy.js and returns done() args
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
}

module.exports = { signInAction };
