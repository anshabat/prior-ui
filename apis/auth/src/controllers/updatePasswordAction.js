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
  const { token, password } = req.body ?? {};
  await resetPassword(token, password);
  return res.json({ success: true, data: true });
};

module.exports = { updatePasswordAction };
