/**
 * @typedef {import('../../types').User} User
 * @typedef {{ message: string, status: number }} VerifyOauthError
 */

const { getUserByEmail, createUser } = require("../repository/userRepository");
const {
  getAccountByProvider,
  createAccount,
} = require("../repository/accountRepository");

/**
 * @param {Object} params
 * @param {string} params.provider
 * @param {string} params.providerAccountId
 * @param {string} params.email
 * @param {string | null} params.name
 * @param {string | null} params.image
 * @returns {Promise<User | null>}
 */
const findOrCreateOAuthUser = async ({
  provider,
  providerAccountId,
  email,
  name = null,
  image = null,
}) => {
  const existingAccount = await getAccountByProvider(
    provider,
    providerAccountId,
  );

  if (existingAccount) {
    return existingAccount.user;
  }

  let user = email ? await getUserByEmail(email) : null;
  if (!user) {
    user = await createUser({
      email,
      name,
      image,
      emailVerified: new Date(),
    });
  }

  if (user) {
    const account = await createAccount({
      userId: user.id,
      provider,
      providerAccountId,
    });
    if (!account) {
      // TODO: Create the user and account in one transaction. A failed account create returns null after createUser has already persisted the user.
      return null;
    }
  }

  return user;
};

/**
 * @param {Object} params
 * @param {string} params.provider
 * @param {string} params.providerAccountId
 * @param {string | undefined} params.email
 * @param {string | null} params.name
 * @param {string | null} params.image
 * @returns {Promise<{data: User | null, error: VerifyOauthError | null}>}
 */
const verifyOauthUser = async ({
  provider,
  providerAccountId,
  email,
  name,
  image,
}) => {
  if (!email) {
    return {
      data: null,
      error: { message: "No email provided", status: 400 },
    };
  }

  const user = await findOrCreateOAuthUser({
    provider,
    providerAccountId,
    name,
    email,
    image,
  });
  if (!user) {
    return { data: null, error: { message: "No user found", status: 401 } };
  }

  return { data: user, error: null };
};

module.exports = { verifyOauthUser };
