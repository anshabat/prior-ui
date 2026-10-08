/**
 * @typedef {import('../../types').TwoFactorToken} TwoFactorToken
 */

const db = require("../lib/db");

/**
 * @param {string} email
 * @returns {Promise<TwoFactorToken | null>}
 */
const getTwoFactorTokenByEmail = async (email) => {
  try {
    return await db.twoFactorToken.findFirst({ where: { email } });
  } catch (error) {
    console.error("Error getting two factor token by email", error);
    return null;
  }
};

/**
 * @param {TwoFactorToken} twoFactorToken
 * @returns {Promise<boolean>}
 */
const deleteTwoFactorToken = async (twoFactorToken) => {
  try {
    const deletedToken = await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id },
    });
    return Boolean(deletedToken);
  } catch (error) {
    console.error("Error deleting two factor token", error);
    return false;
  }
};

/**
 * @param {{ email: string, token: string, expires: Date }} data
 * @returns {Promise<TwoFactorToken | null>}
 */
const createTwoFactorToken = async (data) => {
  try {
    return await db.twoFactorToken.create({ data });
  } catch (error) {
    console.error("Error creating two factor token", error);
    return null;
  }
};

module.exports = {
  getTwoFactorTokenByEmail,
  deleteTwoFactorToken,
  createTwoFactorToken,
};
