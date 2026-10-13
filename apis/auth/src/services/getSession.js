const jwt = require("jsonwebtoken");

/**
 * @typedef {import('../../types').AuthSession} AuthSession
 * @typedef {import('../../types').SessionUser} SessionUser
 */

/**
 * @param {number} timestamp
 * @returns {string}
 */
const jwtTimestampToISO = (timestamp) => {
  return new Date(timestamp * 1000).toISOString();
};

/**
 * @param {string | undefined} token
 * @returns {AuthSession}
 */
const getSession = (token) => {
  if (!token) {
    throw new Error("No session found");
  }

  try {
    const decoded = /** @type {SessionUser & { exp: number; iat: number }} */ (
      jwt.verify(token, process.env.AUTH_SECRET)
    );
    const { exp, iat, ...user } = decoded; // eslint-disable-line no-unused-vars

    return {
      user,
      expires: jwtTimestampToISO(exp),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    throw new Error("Invalid token");
  }
};

module.exports = { getSession };
