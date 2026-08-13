/** @typedef {import("@auth/core/jwt").JWT} JWT */
/** @typedef {import('../../types').SessionUser} SessionUser */
/**
 *
 * @param {string | undefined} cookieHeader
 * @returns {string | null}
 */
const getCallbackUrlFromCookie = (cookieHeader) => {
  const cookies = cookieHeader?.split("; ") || [];
  const callbackCookie = cookies.find((c) =>
    c.startsWith("authjs.callback-url="),
  );
  return callbackCookie
    ? decodeURIComponent(callbackCookie.split("=")[1])
    : null;
};

/**
 *
 * @param {JWT} token
 * @returns {SessionUser}
 */
const transformAuthTokenToSessionUser = (token) => {
  return {
    id: token.sub ?? "",
    name: token.name ?? "",
    email: token.email ?? "",
    image: token.picture ?? null,
    role: token.role,
    provider: token.provider,
  };
};

module.exports = {
  getCallbackUrlFromCookie,
  transformAuthTokenToSessionUser,
};
