/**
 * @typedef {import('../../types').UpdatePasswordPayload} UpdatePasswordPayload
 * @typedef {import('../../types').UpdatePasswordResponse} UpdatePasswordResponse
 */

const { resetPassword } = require("../services/passwordResetService");

/**
 * @param {import('express').Request<{}, {}, UpdatePasswordPayload>} req
 * @param {import('express').Response<UpdatePasswordResponse>} res
 * @returns {Promise<import('express').Response>}
 */
const updatePasswordAction = async (req, res) => {
  try {
    const { token, password } = req.body ?? {};
    await resetPassword(token, password);
    return res.json({ success: true, data: true });
  } catch (error) {
    console.error("Failed to update password", error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: "Failed to update password" });
  }
};

module.exports = { updatePasswordAction };
