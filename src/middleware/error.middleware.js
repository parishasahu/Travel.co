const ApiError = require('../utils/ApiError');
const { nodeEnv } = require('../config/env');

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // If it's not already an ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new ApiError(400, 'Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired');
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors.length > 0 && { errors: error.errors }),
    // Only include stack trace in development
    ...(nodeEnv === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;