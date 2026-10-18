/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

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
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = { asyncErrorHandler, globalErrorHandlerMiddleware };
