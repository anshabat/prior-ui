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
  try {
    const { email, callbackUrl } = req.body ?? {};
    await requestPasswordReset(email, callbackUrl);

    return res.json({ success: true, data: true });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: "Failed to reset password" });
  }
};

module.exports = { resetPasswordAction };
