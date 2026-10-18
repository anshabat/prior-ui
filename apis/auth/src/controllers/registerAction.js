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
 * @returns {Promise<Response>}
 */
async function registerAction(req, res) {
  const { email, password } = req.body ?? {};
  await registerUser(email, password);
  return res.json({ data: true, error: null });
}

module.exports = { registerAction };
