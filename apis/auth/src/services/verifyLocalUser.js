/**
 * @typedef {import('../../types').User} User
 * @typedef {{ message: string, status: number }} VerifyLocalError
 */

const { comparePassword } = require("../lib/password");
const { getUserByEmail } = require("../repository/userRepository");
const {
  getVerificationTokenByEmail,
} = require("../repository/verificationTokenRepository");
const {
  generateVerificationToken,
} = require("./generateVerificationToken");
const { ErrorCode } = require("../lib/error");

/**
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const resendVerificationEmail = async (email) => {
  const existingToken = await getVerificationTokenByEmail(email);
  const isExpired =
    existingToken && new Date(existingToken.expires) < new Date();

  if (!existingToken || isExpired) {
    await generateVerificationToken(email);
    return true;
  }

  return false;
};

/**
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ data: User | null, error: VerifyLocalError | null }>}
 */
const verifyLocalUser = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      data: null,
      error: { message: ErrorCode.CREDENTIALS_SIGN_IN, status: 401 },
    };
  }

  if (!user.password) {
    return {
      data: null,
      error: { message: "AccountNotLinked", status: 403 },
    };
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return {
      data: null,
      error: { message: ErrorCode.CREDENTIALS_SIGN_IN, status: 401 },
    };
  }

  if (!user.emailVerified) {
    await resendVerificationEmail(email);
    return {
      data: null,
      error: { message: "EmailRequired", status: 403 },
    };
  }

  return { data: user, error: null };
};

module.exports = { verifyLocalUser };
