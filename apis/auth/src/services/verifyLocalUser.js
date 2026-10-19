/**
 * @typedef {import('../../types').User} User
 */

const { comparePassword } = require("../lib/password");
const { getUserByEmail } = require("../repository/userRepository");
const {
  getVerificationTokenByEmail,
} = require("../repository/verificationTokenRepository");
const { issueVerificationToken } = require("./issueVerificationToken");
const { ErrorCode, HttpError } = require("../lib/error");

/**
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<User>}
 */
const verifyLocalUser = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new HttpError(
      "Local sign-in rejected",
      ErrorCode.CREDENTIALS_SIGN_IN,
      401,
    );
  }

  if (!user.password) {
    throw new HttpError(
      "Local sign-in rejected for unlinked account",
      ErrorCode.ACCOUNT_NOT_LINKED,
      403,
    );
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new HttpError(
      "Local sign-in rejected",
      ErrorCode.CREDENTIALS_SIGN_IN,
      401,
    );
  }

  if (!user.emailVerified) {
    const existingToken = await getVerificationTokenByEmail(email);
    const isExpired =
      existingToken && new Date(existingToken.expires) < new Date();
    if (!existingToken || isExpired) {
      await issueVerificationToken(email);
    }
    throw new HttpError(
      "Local sign-in rejected for unverified email",
      ErrorCode.EMAIL_VERIFICATION_REQUIRED,
      403,
    );
  }

  return user;
};

module.exports = { verifyLocalUser };
