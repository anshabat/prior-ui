const { HttpError, ErrorCode } = require("../lib/error");
const {
  getVerificationTokenByToken,
  confirmVerificationToken,
} = require("../repository/verificationTokenRepository");

/**
 * @param {string} token
 * @returns {Promise<void>}
 */
const verifyEmail = async (token) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    throw new HttpError(
      "Verification token not found",
      ErrorCode.EMAIL_NOT_VERIFIED,
      400,
      { token },
    );
  }

  if (new Date(verificationToken.expires) < new Date()) {
    throw new HttpError(
      "Verification token expired",
      ErrorCode.EMAIL_NOT_VERIFIED,
      400,
      { token, expired_at: verificationToken.expires },
    );
  }

  await confirmVerificationToken(verificationToken);
};

module.exports = { verifyEmail };
