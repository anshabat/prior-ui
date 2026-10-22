/**
 * @typedef {import('../../types').TwoFactorToken} TwoFactorToken
 */

const db = require("../lib/db");

/**
 * @param {string} email
 * @returns {Promise<TwoFactorToken | null>}
 */
const getTwoFactorTokenByEmail = (email) => {
  return db.twoFactorToken.findFirst({ where: { email } });
};

/**
 * @param {TwoFactorToken} twoFactorToken
 * @returns {Promise<TwoFactorToken>}
 */
const deleteTwoFactorToken = (twoFactorToken) => {
  return db.twoFactorToken.delete({
    where: { id: twoFactorToken.id },
  });
};

/**
 * @param {{ email: string, token: string, expires: Date }} data
 * @returns {Promise<TwoFactorToken>}
 */
const createTwoFactorToken = (data) => {
  return db.twoFactorToken.create({ data });
};

module.exports = {
  getTwoFactorTokenByEmail,
  deleteTwoFactorToken,
  createTwoFactorToken,
};
