/**
 * @typedef {import('../../types').User} User
 */

const { HttpError, ErrorCode } = require("../lib/error");
const { createCredentialsJWT } = require("../lib/jwt");
const { getSession } = require("./getSession");
const {
  verifyTwoFactorCode,
  issueTwoFactorToken,
} = require("./twoFactorService");

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
      "Local authentication failed",
      info?.message || ErrorCode.CREDENTIALS_SIGN_IN,
      info?.status || 401,
      info ?? null,
    );
  }

  if (user?.isTwoFactorEnabled) {
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

module.exports = { resolveSignIn };
