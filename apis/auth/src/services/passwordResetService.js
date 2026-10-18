const { HttpError, ErrorCode } = require("../lib/error");
const { sendPasswordResetEmail } = require("../lib/mail");
const { generatePasswordHash } = require("../lib/password");
const { generatePasswordResetToken } = require("./generatePasswordResetToken");
const {
  confirmPasswordResetToken,
  getPasswordResetTokenByToken,
} = require("../repository/passwordResetTokenRepository");
const { getUserByEmail } = require("../repository/userRepository");

/**
 * @param {string} email
 * @param {string} callbackUrl
 * @returns {Promise<void>}
 */
const requestPasswordReset = async (email, callbackUrl) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    // TODO: Prevent user enumeration — return 200 OK silently instead of throwing
    throw new HttpError(
      "Password reset requested for nonexistent user",
      ErrorCode.PASSWORD_RESET_FAILED,
      400,
      { email },
    );
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(email, passwordResetToken.token, callbackUrl);
};

/**
 * @param {string} token
 * @param {string} password
 * @returns {Promise<void>}
 */
const resetPassword = async (token, password) => {
  const passwordResetToken = await getPasswordResetTokenByToken(token);

  if (!passwordResetToken) {
    throw new HttpError(
      "Password reset token not found",
      ErrorCode.PASSWORD_RESET_FAILED,
      400,
    );
  }

  if (passwordResetToken.expires < new Date()) {
    throw new HttpError(
      "Password reset token expired",
      ErrorCode.PASSWORD_RESET_FAILED,
      400,
      {
        email: passwordResetToken.email,
        expired_at: passwordResetToken.expires,
      },
    );
  }

  const user = await getUserByEmail(passwordResetToken.email);
  if (!user) {
    throw new HttpError(
      "Password reset token user not found",
      ErrorCode.PASSWORD_RESET_FAILED,
      400,
      { email: passwordResetToken.email },
    );
  }

  const passwordHash = await generatePasswordHash(password);
  await confirmPasswordResetToken(user.id, passwordHash, passwordResetToken.id);
};

module.exports = { requestPasswordReset, resetPassword };
