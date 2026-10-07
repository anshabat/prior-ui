/**
 * @typedef {import('../../types').UpdatePasswordPayload} UpdatePasswordPayload
 * @typedef {import('../../types').UpdatePasswordResponse} UpdatePasswordResponse
 */

const {
  getPasswordResetTokenByToken,
  getUserByEmail,
  updateUserPasswordByToken,
} = require("../lib/utils");
/**
 * @param {import('express').Request<{}, {}, UpdatePasswordPayload>} req
 * @param {import('express').Response<UpdatePasswordResponse>} res
 * @returns {Promise<import('express').Response>}
 */
const updatePasswordAction = async (req, res) => {
  try {
    const { token, password } = req.body ?? {};
    const passwordResetToken = await getPasswordResetTokenByToken(token);

    if (!passwordResetToken) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired token" });
    }

    if (passwordResetToken.expires < new Date()) {
      return res.status(400).json({ success: false, error: "Token expired" });
    }

    const user = await getUserByEmail(passwordResetToken.email);
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    await updateUserPasswordByToken(user.id, passwordResetToken.id, password);
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
