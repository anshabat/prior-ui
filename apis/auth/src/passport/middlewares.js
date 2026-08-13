/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('../../types').User} User
 */

const { createOauthJWT } = require("./utils.js");

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
      const msg = err?.message || "Unauthorized";
      return res.redirect(`${returnUrl}?error=${msg}`);
    }

    const token = createOauthJWT(user, provider);
    res.cookie("authToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    res.redirect(returnUrl);
  };

module.exports = {
  useOauthReturnUrl,
  createOAuthCallbackHandler,
};
