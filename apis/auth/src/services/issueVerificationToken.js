const { randomUUID } = require("node:crypto");
const { sendVerificationEmail } = require("../lib/mail");
const {
  replaceVerificationToken,
} = require("../repository/verificationTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<void>}
 */
const issueVerificationToken = async (email) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  const verificationToken = await replaceVerificationToken({
    email,
    token,
    expires,
  });
  await sendVerificationEmail(email, verificationToken.token);
};

module.exports = { issueVerificationToken };
