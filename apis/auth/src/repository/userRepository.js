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

module.exports = {
  getUserByEmail,
  createUser,
};
