/**
 * @typedef {import('../../types').AuthSession} AuthSession
 * @typedef {import('../../types').SessionUser} SessionUser
 */

const jwt = require("jsonwebtoken");

/**
 * @param {string | undefined} token
 * @returns {AuthSession}
 */
const getSession = (token) => {
  if (!token) {
    throw new Error("No session found");
  }

  const decoded = /** @type {SessionUser & { exp: number; iat: number }} */ (
    jwt.verify(token, process.env.AUTH_SECRET)
  );
  const { exp, iat, ...user } = decoded; // eslint-disable-line no-unused-vars

  return {
    user,
    expires: new Date(exp * 1000).toISOString(),
  };
};

module.exports = { getSession };
