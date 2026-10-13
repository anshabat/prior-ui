/**
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const { randomUUID } = require("node:crypto");
const { sendVerificationEmail } = require("../lib/mail");
const {
  replaceVerificationToken,
} = require("../repository/verificationTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<VerificationToken>}
 */
const generateVerificationToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const verificationToken = await replaceVerificationToken({
    email,
    token,
    expires,
  });
  if (!verificationToken) {
    throw new Error("Failed to generate verification token");
  }

  await sendVerificationEmail(email, verificationToken.token);

  return verificationToken;
};

module.exports = { generateVerificationToken };
