/**
 * @typedef {import('../../types').ResetPasswordPayload} ResetPasswordPayload
 * @typedef {import('../../types').ResetPasswordResponse} ResetPasswordResponse
 */

const { sendPasswordResetEmail } = require("../lib/mail.js");
const {
  generatePasswordResetToken,
} = require("../services/generatePasswordResetToken");
const { getUserByEmail } = require("../repository/userRepository");

/**
 * @param {import('express').Request<{}, {}, ResetPasswordPayload>} req
 * @param {import('express').Response<ResetPasswordResponse>} res
 * @returns {Promise<import('express').Response>}
 */
const resetPasswordAction = async (req, res) => {
  try {
    const { email, callbackUrl } = req.body ?? {};
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      throw new Error("Failed to request password reset");
    }

    await sendPasswordResetEmail(email, passwordResetToken.token, callbackUrl);

    return res.json({ success: true, data: true });
  } catch (error) {
    console.error("Failed to request password reset", error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res
      .status(500)
      .json({ success: false, error: "Failed to request password reset" });
  }
};

module.exports = { resetPasswordAction };
