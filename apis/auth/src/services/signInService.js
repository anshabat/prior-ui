/**
 * @typedef {import('../../types').User} User
 */

const { HttpError, ErrorCode } = require("../lib/error");
const { createCredentialsJWT } = require("../lib/jwt");
const { comparePassword } = require("../lib/password");
const {
  getVerificationTokenByEmail,
} = require("../repository/verificationTokenRepository");
const { getUserByEmail } = require("../repository/userRepository");
const { getSession } = require("./getSession");
const { issueVerificationToken } = require("./issueVerificationToken");
const {
  verifyTwoFactorCode,
  issueTwoFactorToken,
} = require("./twoFactorService");

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

  return user;
};

/**
 * @param {Object} params
 * @param {User | false | null | undefined} params.user
 * @param {{ message?: string, status?: number }} [params.info]
 * @param {Error | null | undefined} params.err
 * @param {string | undefined} params.code
 */
const resolveSignIn = async ({ user, info, err, code }) => {
  if (err) {
    throw new HttpError(err.message, ErrorCode.SIGN_IN_FAILED, 500);
  }

  if (!user) {
    throw new HttpError(
      info?.message || "Local authentication failed",
      ErrorCode.CREDENTIALS_SIGN_IN,
      info?.status || 401,
      info,
    );
  }

  if (!user.emailVerified) {
    const existingToken = await getVerificationTokenByEmail(user.email);
    const isExpired =
      existingToken && new Date(existingToken.expires) < new Date();
    if (!existingToken || isExpired) {
      await issueVerificationToken(user.email);
    }
    throw new HttpError(
      "Local sign-in rejected for unverified email",
      ErrorCode.EMAIL_VERIFICATION_REQUIRED,
      403,
    );
  }

  if (user.isTwoFactorEnabled) {
    if (code) {
      await verifyTwoFactorCode(user.email, code);
    } else {
      await issueTwoFactorToken(user.email);

      return { session: null, twoFactor: true, jwt: null };
    }
  }

  const jwt = createCredentialsJWT(user);
  const session = getSession(jwt);

  return { session, twoFactor: false, jwt };
};

module.exports = { resolveSignIn, verifyLocalUser };
