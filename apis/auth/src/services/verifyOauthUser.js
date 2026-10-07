/**
 * @typedef {import('../../types').User} User
 */

const { findOrCreateOAuthUser } = require("../lib/utils");
/**
 * @param {Object} params
 * @param {string} params.provider
 * @param {string} params.providerAccountId
 * @param {string | undefined} params.email
 * @param {string | null} params.name
 * @param {string | null} params.image
 * @returns {Promise<{data: User | null, error: Error | null}>}
 */
const verifyOauthUser = async ({
  provider,
  providerAccountId,
  email,
  name,
  image,
}) => {
  if (!email) {
    return { data: null, error: new Error("No email provided") };
  }

  const user = await findOrCreateOAuthUser({
    provider,
    providerAccountId,
    name,
    email,
    image,
  });
  if (!user) {
    return { data: null, error: new Error("No user found") };
  }

  return { data: user, error: null };
};

module.exports = { verifyOauthUser };
