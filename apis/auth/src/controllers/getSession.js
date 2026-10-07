/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { extractSessionFromJWT } = require("../lib/jwt");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
function getSession(req, res) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: "No session found" });
  }

  try {
    const session = extractSessionFromJWT(token);
    return res.status(200).json(session);
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { getSession };
