/**
 * @typedef {import('../../types').User} User
 */

const { HttpError, ErrorCode } = require("../lib/error");
const { getUserByEmail, createUser } = require("../repository/userRepository");
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

  let user = await getUserByEmail(email);
  if (!user) {
    user = await createUser({
      email,
      name,
      image,
      emailVerified: new Date(),
    });
  }

  // TODO: Create the user and account in one transaction. A failed account create returns null after createUser has already persisted the user.
  await createAccount({
    userId: user.id,
    provider,
    providerAccountId,
  });

  return user;
};

module.exports = { verifyOauthUser };
