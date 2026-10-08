/**
 * @typedef {import('../../types').Account} Account
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').CreateAccountData} CreateAccountData
 * @typedef {Account & { user: User }} AccountWithUser
 */

const db = require("../lib/db");

/**
 * @param {string} provider
 * @param {string} providerAccountId
 * @returns {Promise<AccountWithUser | null>}
 */
const getAccountByProvider = async (provider, providerAccountId) => {
  try {
    return await db.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
});
  } catch {
    return null;
  }
};

/**
 * @param {CreateAccountData} data
 * @returns {Promise<Account | null>}
 */
const createAccount = async (data) => {
  try {
    return await db.account.create({ data });
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

module.exports = {
  getAccountByProvider,
  createAccount,
};
