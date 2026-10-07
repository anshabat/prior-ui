/**
 * @typedef {import('../../types').SignOutResponse} SignOutResponse
 */

/**
 * Clears the auth cookie and ends the session.
 * @param {import('express').Request} _req
 * @param {import('express').Response<SignOutResponse>} res
 * @returns {import('express').Response<SignOutResponse>}
 */
function logoutAction(_req, res) {
  res.clearCookie("authToken", { path: "/" });
  return res.status(200).json({ data: true, error: null });
}

module.exports = { logoutAction };
