/**
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('../../types').User} User
 */

const passport = require("passport");
const { createOauthJWT } = require("../passport/utils");

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
  return (req, res, next) => {
    passport.authenticate(
      provider,
      { session: false },
      /**
       * @param {Error | null} err
       * @param {User | false} user
       */
      async (err, user) => {
        const serverRoot = `${req.protocol}://${req.get("host")}`;
        const returnUrl = req.cookies.oauth_return_url || serverRoot;

        res.clearCookie("oauth_return_url");

        if (err || !user) {
          console.error(
            `OAuth ${provider} callback failed:`,
            err ?? "Unauthorized",
          );
          return res.redirect(
            buildOauthRedirectUrl(returnUrl, "OAuthSignInError"),
          );
        }

        const token = createOauthJWT(user, provider);
        res.cookie("authToken", token, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
        });
        return res.redirect(buildOauthRedirectUrl(returnUrl));
      },
    )(req, res, next);
  };
}

module.exports = { createOauthCallbackAction };
