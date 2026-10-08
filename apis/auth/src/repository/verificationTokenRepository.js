/**
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const db = require("../lib/db");

/**
 * @param {string} token
 * @returns {Promise<VerificationToken | null>}
 */
const getVerificationTokenByToken = async (token) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });

    return verificationToken;
  } catch (error) {
    console.error("Error getting verification token by token", error);
    return null;
  }
};

/**
 * @param {string} email
 * @returns {Promise<VerificationToken | null>}
 */
const getVerificationTokenByEmail = async (email) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

/**
 * @param {string} id
 * @returns {Promise<VerificationToken | null>}
 */
const deleteVerificationToken = async (id) => {
  try {
    return await db.verificationToken.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};

/**
 * @param {{ email: string, token: string, expires: Date }} data
 * @returns {Promise<VerificationToken | null>}
 */
const createVerificationToken = async (data) => {
  try {
    return await db.verificationToken.create({ data });
  } catch {
    return null;
  }
};

/**
 * Marks the token's email as verified and deletes the token.
 * @param {VerificationToken} verificationToken
 * @returns {Promise<boolean>}
 */
const confirmVerificationToken = async (verificationToken) => {
  try {
    await db.$transaction([
      db.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: new Date() },
      }),
      db.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error consuming verification token", error);
    return false;
  }
};

module.exports = {
  getVerificationTokenByToken,
  getVerificationTokenByEmail,
  deleteVerificationToken,
  createVerificationToken,
  confirmVerificationToken,
};
