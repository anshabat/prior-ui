const { generatePasswordHash } = require("../lib/password");
const {
  confirmPasswordResetToken,
} = require("../repository/passwordResetTokenRepository");

/**
 * @param {string} userId
 * @param {string} tokenId
 * @param {string} password
 * @returns {Promise<void>}
 */
const updateUserPasswordByToken = async (userId, tokenId, password) => {
  if (!userId || !password || !tokenId) {
    throw new Error("Missing params");
  }

  const passwordHash = await generatePasswordHash(password);
  const confirmed = await confirmPasswordResetToken(
    userId,
    passwordHash,
    tokenId,
  );
  if (!confirmed) {
    throw new Error("Failed to update user password");
  }
};

module.exports = { updateUserPasswordByToken };
