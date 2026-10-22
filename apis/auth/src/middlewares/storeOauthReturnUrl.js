/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

const { oauthReturnUrlCookie } = require("../lib/cookies");

/**
 * Reusable middleware to store the OAuth return URL
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const storeOauthReturnUrl = (req, res, next) => {
  const returnUrl = req.query.callbackUrl || req.headers.referer;

  if (typeof returnUrl === "string") {
    oauthReturnUrlCookie.set(res, returnUrl);
  } else {
    oauthReturnUrlCookie.clear(res);
  }

  next();
};

module.exports = {
  storeOauthReturnUrl,
};
