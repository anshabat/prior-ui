/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { config } = require("@workspace/config");
const { verifyEmail } = require("../services/emailVerification");

const { APP_BASE_URL } = config.auth;

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
async function verifyEmailAction(req, res) {
  const { token } = req.query;

  await verifyEmail(token);
  res.redirect(APP_BASE_URL);
}

module.exports = { verifyEmailAction };
