/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { authTokenCookie, oauthReturnUrlCookie } = require("../lib/cookies");
const { createOauthJWT } = require("../lib/jwt");
const { authenticateOAuth } = require("../lib/passport");

/**
 * Replace or remove the error search param on an absolute return URL.
 * @param {string} returnUrl
 * @param {string} [error]
 * @returns {string}
 */
const buildOauthRedirectUrl = (returnUrl, error) => {
  const url = new URL(returnUrl);

  if (error) {
    url.searchParams.set("error", error);
  } else {
    url.searchParams.delete("error");
  }

  return url.href;
};

/**
 * Passport callback for an OAuth provider.
 * Sets the auth cookie and redirects to the stored return URL.
 * @param {string} provider
 * @returns {RequestHandler}
 */
function createOauthCallbackAction(provider) {
  return async (req, res, next) => {
    const { user, err } = await authenticateOAuth(provider, req, res, next);

    const serverRoot = `${req.protocol}://${req.get("host")}`;
    const returnUrl = oauthReturnUrlCookie.get(req) || serverRoot;

    oauthReturnUrlCookie.clear(res);

    if (err || !user) {
      console.error(
        `OAuth ${provider} callback failed:`,
        err ?? "Unauthorized",
      );
      return res.redirect(buildOauthRedirectUrl(returnUrl, "OAuthSignInError"));
    }

    const token = createOauthJWT(user, provider);
    authTokenCookie.set(res, token);
    return res.redirect(buildOauthRedirectUrl(returnUrl));
  };
}

module.exports = { createOauthCallbackAction };
