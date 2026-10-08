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

  try {
    await registerUser(email, password);
    return res.json({ data: true, error: null });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(409).json({ data: false, error: error.message });
    }
    return res
      .status(500)
      .json({ data: false, error: "Internal server error" });
  }
}

module.exports = { registerAction };
