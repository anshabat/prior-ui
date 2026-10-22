/**
 * @typedef {import('../../types').ResetPasswordPayload} ResetPasswordPayload
 * @typedef {import('../../types').ResetPasswordResponse} ResetPasswordResponse
 */

const { requestPasswordReset } = require("../services/passwordResetService");

/**
 * @param {import('express').Request<{}, {}, ResetPasswordPayload>} req
 * @param {import('express').Response<ResetPasswordResponse>} res
 * @returns {Promise<import('express').Response>}
 */
const resetPasswordAction = async (req, res) => {
  const { email, callbackUrl } = req.body ?? {};
  await requestPasswordReset(email, callbackUrl);
  return res.json({ success: true, data: true });
};

module.exports = { resetPasswordAction };
