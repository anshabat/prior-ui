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
const getAccountByProvider = (provider, providerAccountId) => {
  return db.account.findUnique({
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
};

/**
 * @param {CreateAccountData} data
 * @returns {Promise<Account>}
 */
const createAccount = (data) => {
  return db.account.create({ data });
};

module.exports = {
  getAccountByProvider,
  createAccount,
};
