/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').SignInResponse} SignInResponse
 */

const passport = require("passport");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response<SignInResponse>} res
 * @param {import('express').NextFunction} next
 */
const authenticateLocal = (req, res, next) => {
  return new Promise((resolve) => {
    const middleware = passport.authenticate(
      "local",
      { session: false },
      /**
       * @param {Error | null} err
       * @param {User | false} user
       * @param {{ message: string, status?: number }} [info]
       * @returns {void}
       */
      (err, user, info) => resolve({ user, info, err })
    );
    middleware(req, res, next);
  });
};

module.exports = { authenticateLocal };
