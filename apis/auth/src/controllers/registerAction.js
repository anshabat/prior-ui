/**
 * @typedef {import('express').Response} Response
 * @typedef {import('../../types').RegisterPayload} RegisterPayload
 * @typedef {import('../../types').RegisterResponse} RegisterResponse
 */

const { registerUser } = require("../services/registerUser");

/**
 * Registers a new user with the provided email and password.
 * @param {import('express').Request<{}, RegisterResponse, RegisterPayload>} req
 * @param {import('express').Response<RegisterResponse>} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<Response | undefined>}
 */
async function registerAction(req, res, next) {
  const { email, password } = req.body ?? {};
  try {
    await registerUser(email, password);
    return res.json({ data: true, error: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { registerAction };
