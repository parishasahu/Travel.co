const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// This middleware runs AFTER express-validator checks
// It collects all errors and throws a single ApiError
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    throw new ApiError(400, 'Validation failed', messages);
  }
  next();
};

module.exports = validate;