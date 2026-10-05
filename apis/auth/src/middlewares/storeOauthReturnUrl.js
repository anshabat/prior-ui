/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Reusable middleware to store the OAuth return URL
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const storeOauthReturnUrl = (req, res, next) => {
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

module.exports = {
  storeOauthReturnUrl,
};
