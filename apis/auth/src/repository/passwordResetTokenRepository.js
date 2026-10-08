/**
 * @typedef {import('../../types').PasswordResetToken} PasswordResetToken
 */

const db = require("../lib/db");

/**
 * @param {string} token
 * @returns {Promise<PasswordResetToken | null>}
 */
const getPasswordResetTokenByToken = async (token) => {
  try {
    return await db.passwordResetToken.findFirst({ where: { token } });
  } catch (error) {
    console.error("Error getting password reset token by token", error);
    return null;
  }
};

/**
 * @param {string} email
 * @returns {Promise<PasswordResetToken | null>}
 */
const getPasswordResetTokenByEmail = async (email) => {
  try {
    return await db.passwordResetToken.findFirst({ where: { email } });
  } catch {
    return null;
  }
};

/**
 * @param {string} id
 * @returns {Promise<PasswordResetToken | null>}
 */
const deletePasswordResetToken = async (id) => {
  try {
    return await db.passwordResetToken.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};

/**
 * @param {{ email: string, token: string, expires: Date }} data
 * @returns {Promise<PasswordResetToken | null>}
 */
const createPasswordResetToken = async (data) => {
  try {
    return await db.passwordResetToken.create({ data });
  } catch {
    return null;
  }
};

/**
 * Sets the user's password and deletes the reset token.
 * @param {string} userId
 * @param {string} passwordHash
 * @param {string} tokenId
 * @returns {Promise<boolean>}
 */
const confirmPasswordResetToken = async (userId, passwordHash, tokenId) => {
  try {
    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { password: passwordHash },
      }),
      db.passwordResetToken.delete({
        where: { id: tokenId },
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error confirming password reset token", error);
    return false;
  }
};

module.exports = {
  getPasswordResetTokenByToken,
  getPasswordResetTokenByEmail,
  deletePasswordResetToken,
  createPasswordResetToken,
  confirmPasswordResetToken,
};
