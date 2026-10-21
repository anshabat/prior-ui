/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @typedef {object} PublicError
 * @property {string} code
 * @property {number} statusCode
 */

const { config } = require("@workspace/config");
const { buildRedirectUrl } = require("../redirectUrl");
const { ErrorCode } = require("./errorCodes");
const { HttpError } = require("./errors");

const { APP_BASE_URL } = config.auth;

/**
 * Forwards a rejected async route handler to Express error middleware.
 * Express 4 does not do this on its own.
 * @param {(req: Request, res: Response, next: NextFunction) => unknown} handler
 * @returns {import('express').RequestHandler}
 */
const asyncErrorHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

/**
 * Logs the error and resolves the public code and status.
 * Returns null when the response has already started, after passing the error on.
 * @param {Error} err
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {PublicError | null}
 */
const resolvePublicError = (err, res, next) => {
  // A response was already written, so a second write would throw
  // and hide this error. Pass it on; Express logs it and ends the request.
  if (res.headersSent) {
    next(err);
    return null;
  }

  console.error(err);

  if (err instanceof HttpError) {
    if (err.context) {
      console.error(err.context);
    }

    return { code: err.code, statusCode: err.statusCode };
  }

  return { code: ErrorCode.INTERNAL_SERVER_ERROR, statusCode: 500 };
};

/**
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

// eslint-disable-next-line no-unused-vars
function globalErrorHandlerMiddleware(err, req, res, next) {
  const publicError = resolvePublicError(err, res, next);

  if (!publicError) {
    return;
  }

  res.status(publicError.statusCode).json({ error: publicError.code });
}

/**
 * Error handler for a browser page route. Redirects to the app with the error code.
 * API routes keep the JSON response from the global error handler.
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
function redirectErrorHandlerMiddleware(err, req, res, next) {
  const publicError = resolvePublicError(err, res, next);

  if (!publicError) {
    return;
  }

  res.redirect(buildRedirectUrl(APP_BASE_URL, publicError.code));
}

module.exports = {
  asyncErrorHandler,
  globalErrorHandlerMiddleware,
  redirectErrorHandlerMiddleware,
};
