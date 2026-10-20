const { randomInt } = require("node:crypto");
const { HttpError, ErrorCode } = require("../lib/error");
const { sendTwoFactorTokenEmail } = require("../lib/mail");
const {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
  createTwoFactorToken,
} = require("../repository/twoFactorTokenRepository");

/**
 * @param {string} email
 * @returns {Promise<void>}
 */
const issueTwoFactorToken = async (email) => {
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await deleteTwoFactorToken(existingToken);
  }

  const twoFactorToken = await createTwoFactorToken({
    email,
    token: randomInt(100_000, 1_000_000).toString(), // 6 digit code
    expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
  });

  await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
};

/**
 * @param {string} email
 * @param {string} code
 * @returns {Promise<void>}
 */
const verifyTwoFactorCode = async (email, code) => {
  const twoFactorToken = await getTwoFactorTokenByEmail(email);

  if (!twoFactorToken || twoFactorToken.token !== code) {
    throw new HttpError(
      "Two factor token invalid",
      ErrorCode.TWO_FACTOR_INVALID_CODE,
      401,
      { email, code },
    );
  }

  if (twoFactorToken.expires < new Date()) {
    await deleteTwoFactorToken(twoFactorToken);
    throw new HttpError(
      "Two factor token expired",
      ErrorCode.TWO_FACTOR_INVALID_CODE,
      401,
      { email, expired_at: twoFactorToken.expires },
    );
  }

  await deleteTwoFactorToken(twoFactorToken);
};

module.exports = {
  issueTwoFactorToken,
  verifyTwoFactorCode,
};
