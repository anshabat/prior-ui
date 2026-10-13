/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { getSession } = require("../services/getSession");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
function getSessionAction(req, res) {
  const token = req.cookies.authToken;

  try {
    const session = getSession(token);
    return res.status(200).json(session);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { getSession: getSessionAction };
