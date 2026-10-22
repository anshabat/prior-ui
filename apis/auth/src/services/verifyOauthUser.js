/**
 * @typedef {import('../../types').User} User
 */

const { HttpError, ErrorCode } = require("../lib/error");
const {
  getUserByEmail,
  createUserWithAccount,
} = require("../repository/userRepository");
const {
  getAccountByProvider,
  createAccount,
} = require("../repository/accountRepository");

/**
 * @param {Object} params
 * @param {string} params.provider
 * @param {string} params.providerAccountId
 * @param {string | undefined} params.email
 * @param {string | null} params.name
 * @param {string | null} params.image
 * @returns {Promise<User>}
 */
const verifyOauthUser = async ({
  provider,
  providerAccountId,
  email,
  name = null,
  image = null,
}) => {
  if (!email) {
    throw new HttpError("No email provided", ErrorCode.OAUTH_SIGN_IN, 400);
  }

  const existingAccount = await getAccountByProvider(
    provider,
    providerAccountId,
  );

  if (existingAccount) {
    return existingAccount.user;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return createUserWithAccount(
      { email, name, image, emailVerified: new Date() },
      { provider, providerAccountId },
    );
  }

  await createAccount({
    userId: user.id,
    provider,
    providerAccountId,
  });

  return user;
};

module.exports = { verifyOauthUser };
