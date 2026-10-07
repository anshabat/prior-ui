/**
 * @typedef {import('../../types').User} User
 * @typedef {{ message: string, status: number }} VerifyLocalError
 */

const bcrypt = require("bcryptjs");
const { getUserByEmail, resendVerificationEmail } = require("../lib/utils");

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
      error: { message: "CredentialsSignin", status: 401 },
    };
  }

  if (!user.password) {
    return {
      data: null,
      error: { message: "AccountNotLinked", status: 403 },
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      data: null,
      error: { message: "CredentialsSignin", status: 401 },
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
