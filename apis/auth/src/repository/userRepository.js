/**
 * @typedef {import('../../types').User} User
 * @typedef {import('../../types').CreateUserData} CreateUserData
 */

const db = require("../lib/db");

/**
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

/**
 * @param {CreateUserData} data
 * @returns {Promise<User | null>}
 */
const createUser = async (data) => {
  try {
    return await db.user.create({ data });
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

module.exports = {
  getUserByEmail,
  createUser,
};
