/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

const { HttpError } = require("./errors");

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
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

// eslint-disable-next-line no-unused-vars
function globalErrorHandlerMiddleware(err, req, res, next) {
  // A response was already written, so a second res.status().json() would throw
  // and hide this error. Pass it on; Express logs it and ends the request.
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err instanceof HttpError) {
    if (err.context) {
      console.error(err.context);
    }

    return res.status(err.statusCode).json({ error: err.code });
  }

  return res.status(500).json({ error: "Internal server error" });
}

module.exports = { asyncErrorHandler, globalErrorHandlerMiddleware };
