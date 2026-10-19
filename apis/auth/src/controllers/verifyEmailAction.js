/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { verifyEmail } = require("../services/verifyEmail");
const { HttpError, ErrorCode } = require("../lib/error");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function verifyEmailAction(req, res) {
  const { token } = req.query;

  // TODO: remove after adding validation layer
  if (typeof token !== "string" || token.length === 0) {
    throw new HttpError(
      "Email verification token is missing or empty",
      ErrorCode.EMAIL_NOT_VERIFIED,
      400,
      { token },
    );
  }

  await verifyEmail(token);
  return res.status(200).json({ success: true });
}

module.exports = { verifyEmailAction };
