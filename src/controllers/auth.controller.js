const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/v1/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.signup({ name, email, password });

  // 201 = Created (not 200 — this is the correct HTTP status for resource creation)
  res.status(201).json(
    new ApiResponse(201, 'Account created successfully', result)
  );
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.status(200).json(
    new ApiResponse(200, 'Login successful', result)
  );
});

// GET /api/v1/auth/me  (protected route)
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the protect middleware (Step 4)
  const user = await authService.getMe(req.user.userId);

  res.status(200).json(
    new ApiResponse(200, 'User fetched successfully', { user })
  );
});

module.exports = { signup, login, getMe };