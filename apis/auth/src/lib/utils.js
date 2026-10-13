/**
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const { randomUUID } = require("node:crypto");
const {
  getVerificationTokenByEmail,
  deleteVerificationToken,
  createVerificationToken,
} = require("../repository/verificationTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<VerificationToken>}
 */
const generateVerificationToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    const deletedToken = await deleteVerificationToken(existingToken.id);
    if (!deletedToken) {
      throw new Error("Failed to delete verification token");
    }
  }

  const verificationToken = await createVerificationToken({
    email,
    token,
    expires,
  });
  if (!verificationToken) {
    throw new Error("Failed to create verification token");
  }

  return verificationToken;
};

module.exports = {
  generateVerificationToken,
};
