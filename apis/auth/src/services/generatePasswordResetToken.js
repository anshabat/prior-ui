/**
 * @typedef {import('../../types').PasswordResetToken} PasswordResetToken
 */

const { randomUUID } = require("node:crypto");
const {
  getPasswordResetTokenByEmail,
  deletePasswordResetToken,
  createPasswordResetToken,
} = require("../repository/passwordResetTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<PasswordResetToken>}
 */
const generatePasswordResetToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    const deletedToken = await deletePasswordResetToken(existingToken.id);
    if (!deletedToken) {
      throw new Error("Failed to delete password reset token");
    }
  }

  const passwordResetToken = await createPasswordResetToken({
    email,
    token,
    expires,
  });
  if (!passwordResetToken) {
    throw new Error("Failed to create password reset token");
  }

  return passwordResetToken;
};

module.exports = { generatePasswordResetToken };
