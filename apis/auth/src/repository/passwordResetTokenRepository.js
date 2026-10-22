/**
 * @typedef {import('../../types').PasswordResetToken} PasswordResetToken
 */

const db = require("../lib/db");

/**
 * @param {string} token
 * @returns {Promise<PasswordResetToken | null>}
 */
const getPasswordResetTokenByToken = (token) => {
  return db.passwordResetToken.findFirst({ where: { token } });
};

/**
 * @param {string} email
 * @returns {Promise<PasswordResetToken | null>}
 */
const getPasswordResetTokenByEmail = (email) => {
  return db.passwordResetToken.findFirst({ where: { email } });
};

/**
 * @param {string} id
 * @returns {Promise<PasswordResetToken>}
 */
const deletePasswordResetToken = (id) => {
  return db.passwordResetToken.delete({
    where: { id },
  });
};

/**
 * @param {{ email: string, token: string, expires: Date }} data
 * @returns {Promise<PasswordResetToken>}
 */
const createPasswordResetToken = (data) => {
  return db.passwordResetToken.create({ data });
};

/**
 * Sets the user's password and deletes the reset token.
 * @param {string} userId
 * @param {string} passwordHash
 * @param {string} tokenId
 * @returns {Promise<boolean>}
 */
const confirmPasswordResetToken = async (userId, passwordHash, tokenId) => {
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
};

module.exports = {
  getPasswordResetTokenByToken,
  getPasswordResetTokenByEmail,
  deletePasswordResetToken,
  createPasswordResetToken,
  confirmPasswordResetToken,
};
