/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').CreateUserData} CreateUserData
 */

const db = require("../lib/db");

/**
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = (email) => {
  return db.user.findUnique({ where: { email } });
};

/**
 * @param {CreateUserData} data
 * @returns {Promise<User>}
 */
const createUser = (data) => {
  return db.user.create({ data });
};

/**
 * @param {CreateUserData} userData
 * @param {{ provider: string, providerAccountId: string }} account
 * @returns {Promise<User>}
 */
const createUserWithAccount = (userData, { provider, providerAccountId }) => {
  return db.user.create({
    data: {
      ...userData,
      accounts: { create: { provider, providerAccountId } },
    },
  });
};

module.exports = {
  getUserByEmail,
  createUser,
  createUserWithAccount,
};
