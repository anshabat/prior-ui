/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

// eslint-disable-next-line no-unused-vars
function globalErrorHandlerMiddleware(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = { globalErrorHandlerMiddleware };
