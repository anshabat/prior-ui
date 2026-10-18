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
    await deletePasswordResetToken(existingToken.id);
  }

  return createPasswordResetToken({
    email,
    token,
    expires,
  });
};

module.exports = { generatePasswordResetToken };
