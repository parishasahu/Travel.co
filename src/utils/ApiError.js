// Why: Standard Error objects don't carry HTTP status codes.
// This lets us throw errors like: throw new ApiError(404, 'Destination not found')
// and our global handler knows exactly what to send back.

class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;