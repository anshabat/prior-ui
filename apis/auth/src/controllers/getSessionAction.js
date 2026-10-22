/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { authTokenCookie } = require("../lib/cookies");
const { getSession } = require("../services/getSession");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
function getSessionAction(req, res) {
  const token = authTokenCookie.get(req);
  const session = getSession(token);
  return res.status(200).json(session);
}

module.exports = { getSession: getSessionAction };
