const { randomUUID } = require("node:crypto");
const { HttpError, ErrorCode } = require("../lib/error");
const { sendVerificationEmail } = require("../lib/mail");
const {
  confirmVerificationToken,
  getVerificationTokenByToken,
  replaceVerificationToken,
} = require("../repository/verificationTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<void>}
 */
const issueVerificationToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  const verificationToken = await replaceVerificationToken({
    email,
    token,
    expires,
  });
  await sendVerificationEmail(email, verificationToken.token);
};

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

module.exports = { issueVerificationToken, verifyEmail };
