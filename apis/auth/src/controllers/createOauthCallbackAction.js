/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { authTokenCookie, oauthReturnUrlCookie } = require("../lib/cookies");
const { HttpError, ErrorCode } = require("../lib/error");
const { createOauthJWT } = require("../lib/jwt");
const { authenticateOAuth } = require("../lib/passport");
const { buildRedirectUrl } = require("../lib/redirectUrl");

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
      const errorCode =
        err instanceof HttpError ? err.code : ErrorCode.OAUTH_SIGN_IN;
      console.error(
        `OAuth ${provider} callback failed:`,
        err ?? "Unauthorized",
      );
      return res.redirect(buildRedirectUrl(returnUrl, errorCode));
    }

    const token = createOauthJWT(user, provider);
    authTokenCookie.set(res, token);
    return res.redirect(buildRedirectUrl(returnUrl));
  };
}

module.exports = { createOauthCallbackAction };
