/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('../types').User} User
 */

const { createOauthJWT } = require("./passport/utils.js");

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
 * Reusable middleware to save OAuth return URL
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const useOauthReturnUrl = (req, res, next) => {
  const returnUrl = req.query.callbackUrl || req.headers.referer;

  if (returnUrl) {
    res.cookie("oauth_return_url", returnUrl, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes
    });
  } else {
    res.clearCookie("oauth_return_url");
  }

  next();
};

/**
 * @typedef {(err: Error | null, user: User | false) => Promise<void>} PassportAuthHandler
 * @param {string} provider
 * @returns {(req: Request, res: Response) => PassportAuthHandler}
 */
const createOAuthCallbackHandler =
  (provider) => (req, res) => async (err, user) => {
    const serverRoot = `${req.protocol}://${req.get("host")}`;
    const returnUrl = req.cookies.oauth_return_url || serverRoot;

    res.clearCookie("oauth_return_url");

    if (err || !user) {
      console.error(`OAuth ${provider} callback failed:`, err ?? "Unauthorized");
      return res.redirect(buildOauthRedirectUrl(returnUrl, "OAuthSignInError"));
    }

    const token = createOauthJWT(user, provider);
    res.cookie("authToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    res.redirect(buildOauthRedirectUrl(returnUrl));
  };

module.exports = {
  useOauthReturnUrl,
  createOAuthCallbackHandler,
};
