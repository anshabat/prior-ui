/**
 * @typedef {import('../../types').User} User
 * @typedef {{ message: string, status: number }} VerifyOauthError
 */

const { findOrCreateOAuthUser } = require("../lib/utils");
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
