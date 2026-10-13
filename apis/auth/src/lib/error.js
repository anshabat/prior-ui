class DomainError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=400]
   * @param {string} [code='DOMAIN_ERROR']
   */
  constructor(message, statusCode = 400, code = "DOMAIN_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    // Captures a clean stack trace excluding this constructor call (Node.js/V8)
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}

class NotFoundError extends DomainError {
  /**
   * @param {string} entity
   * @param {string|number} id
   */
  constructor(entity, id) {
    super(`${entity} with ID ${id} not found`, 404, "NOT_FOUND");
  }
}

class BusinessRuleViolationError extends DomainError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 422, "UNPROCESSABLE_ENTITY");
  }
}

class UnauthorizedError extends DomainError {
  /**
   * @param {string} [message='Unauthorized']
   */
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

module.exports = {
  BusinessRuleViolationError,
  DomainError: Error,
  NotFoundError,
  UnauthorizedError,
};
