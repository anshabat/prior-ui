/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { verifyEmail } = require("../services/emailVerification");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function verifyEmailAction(req, res) {
  const { token } = req.query;

  await verifyEmail(token);
  return res.status(200).json({ success: true });
}

module.exports = { verifyEmailAction };
