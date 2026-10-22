/**
 * @typedef {import('../../types').VerificationToken} VerificationToken
 */

const db = require("../lib/db");

/**
 * @param {string} token
 * @returns {Promise<VerificationToken | null>}
 */
const getVerificationTokenByToken = (token) => {
  return db.verificationToken.findFirst({
    where: { token },
  });
};

/**
 * @param {string} email
 * @returns {Promise<VerificationToken | null>}
 */
const getVerificationTokenByEmail = (email) => {
  return db.verificationToken.findFirst({
    where: { email },
  });
};

/**
 * Replaces any existing token for the email with the given one.
 * @param {{ email: string, token: string, expires: Date }} data
 * @returns {Promise<VerificationToken>}
 */
const replaceVerificationToken = ({ email, token, expires }) => {
  return db.$transaction(async (tx) => {
    const existingToken = await tx.verificationToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      await tx.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }

    return tx.verificationToken.create({
      data: { email, token, expires },
    });
  });
};

/**
 * Marks the token's email as verified and deletes the token.
 * @param {VerificationToken} verificationToken
 * @returns {Promise<boolean>}
 */
const confirmVerificationToken = async (verificationToken) => {
  await db.$transaction([
    db.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    }),
    db.verificationToken.delete({
      where: { id: verificationToken.id },
    }),
  ]);

  return true;
};

module.exports = {
  getVerificationTokenByToken,
  getVerificationTokenByEmail,
  replaceVerificationToken,
  confirmVerificationToken,
};
