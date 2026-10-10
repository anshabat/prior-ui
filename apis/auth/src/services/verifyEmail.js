const {
  getVerificationTokenByToken,
  confirmVerificationToken,
} = require("../repository/verificationTokenRepository");

/**
 * @param {string} token
 * @returns {Promise<boolean>}
 */
const verifyEmail = async (token) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    // TODO: Logger
    console.error("Verification token not found");
    throw new Error("Verification");
  }

  if (new Date(verificationToken.expires) < new Date()) {
    // TODO: Logger
    console.error("Verification token expired");
    throw new Error("Verification");
  }

  const confirmed = await confirmVerificationToken(verificationToken);
  if (!confirmed) {
    throw new Error("Verification");
  }

  return true;
};

module.exports = { verifyEmail };
