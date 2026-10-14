/** @enum {string} */
const ErrorCode = Object.freeze({
  PASSWORD_RESET_FAILED: "PASSWORD_RESET_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
});

class HttpError extends Error {
  /**
   * @param {string} message - Technical log message (never sent to client)
   * @param {string} code - Public machine-readable code
   * @param {number} [statusCode=500] - HTTP status code
   * @param {Record<string, any> | null} [context=null] - Internal debug metadata (never sent to client)
   */
  constructor(message, code, statusCode = 500, context = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    //
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}

/**
 * @typedef {Object} FieldError
 * @property {string} field
 * @property {string} code
 */

class ValidationError extends HttpError {
  /**
   * @param {string} message - Technical log message
   * @param {FieldError[]} errors - Public array of field violations
   * @param {Record<string, any> | null} [context=null] - Internal debug metadata
   */
  constructor(message, errors, context = null) {
    super(message, ErrorCode.VALIDATION_FAILED, 422, context);
    /** @type {FieldError[]} */
    this.errors = errors;
  }
}

module.exports = {
  HttpError,
  ValidationError,
  ErrorCode,
};
