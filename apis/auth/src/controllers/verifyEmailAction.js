/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { verifyEmail } = require("../services/verifyEmail");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
async function verifyEmailAction(req, res) {
  const { token } = req.query;

  try {
    if (typeof token !== "string" || token.length === 0) {
      throw new Error("Invalid token");
    }
    await verifyEmail(token);
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: "Failed to verify email" });
  }
}

module.exports = { verifyEmailAction };
