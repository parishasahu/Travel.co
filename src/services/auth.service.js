const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

// ─── Token generation ─────────────────────────────────────────────────────────
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },   // payload — keep it minimal
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

// ─── Signup ───────────────────────────────────────────────────────────────────
const signup = async ({ name, email, password }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Create user — password hashing happens automatically in the pre-save hook
  const user = await User.create({ name, email, password });

  // Generate token immediately so the user is logged in after signup
  const token = generateToken(user._id, user.role);

  return { user: user.toSafeObject(), token };
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  // We must explicitly select password since we set select: false on the model
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // IMPORTANT: never say "email not found" — that leaks which emails exist
    // Always give the same error for wrong email OR wrong password
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.role);
  return { user: user.toSafeObject(), token };
};

// ─── Get current user (for /me route) ────────────────────────────────────────
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user.toSafeObject();
};

module.exports = { signup, login, getMe };