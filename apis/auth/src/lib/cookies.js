/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').CookieOptions} CookieOptions
 */

/**
 * @param {{ name: string, options?: CookieOptions }} config
 */
const createCookie = ({ name, options = {} }) => {
  /** @type {CookieOptions} */
  const defaultOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // enable in production (requires HTTPS)
    ...options,
  };

  return {
    /**
     * @param {Request} req
     * @returns {string | undefined}
     */
    get: (req) => {
      const value = req.cookies?.[name];
      return typeof value === "string" ? value : undefined;
    },

    /**
     * @param {Response} res
     * @param {string} value
     */
    set: (res, value) => {
      res.cookie(name, value, defaultOptions);
    },

    /**
     * @param {Response} res
     */
    clear: (res) => {
      const clearOptions = { ...defaultOptions };
      delete clearOptions.maxAge;
      delete clearOptions.expires;

      res.clearCookie(name, clearOptions);
    },
  };
};

/** Session JWT. Lifetime comes from the token expiry. */
const authTokenCookie = createCookie({
  name: "authToken",
});

/** Short-lived handoff between the OAuth start and the callback. */
const oauthReturnUrlCookie = createCookie({
  name: "oauth_return_url",
  options: {
    maxAge: 10 * 60 * 1000, // 10 minutes
  },
});

module.exports = {
  authTokenCookie,
  oauthReturnUrlCookie,
};
