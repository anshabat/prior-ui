const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
const generatePasswordHash = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * @param {string} password
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

module.exports = {
  generatePasswordHash,
  comparePassword,
};
