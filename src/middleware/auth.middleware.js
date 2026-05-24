const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { jwtSecret } = require('../config/env');

// ─── protect: verify JWT, attach user to req ─────────────────────────────────
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Tokens arrive in the Authorization header as: "Bearer <token>"
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'You must be logged in to access this resource');
  }

  // jwt.verify throws automatically if token is invalid or expired
  // Our global error middleware catches those and sends the right response
  const decoded = jwt.verify(token, jwtSecret);

  // Attach decoded payload to req so controllers can use req.user
  req.user = decoded; // { userId, role, iat, exp }

  next();
});

// ─── restrictTo: role-based access control ───────────────────────────────────
// Usage: router.delete('/users/:id', protect, restrictTo('admin'), controller)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }
    next();
  };
};

module.exports = { protect, restrictTo };