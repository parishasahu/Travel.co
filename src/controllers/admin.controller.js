const adminService = require('../services/admin.service');
const ApiResponse  = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getPlatformStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getPlatformStats();
  res.status(200).json(new ApiResponse(200, 'Platform stats fetched', stats));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, 'Users fetched', result));
});

const getUserById = asyncHandler(async (req, res) => {
  const result = await adminService.getUserById(req.params.userId);
  res.status(200).json(new ApiResponse(200, 'User fetched', result));
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const result = await adminService.toggleUserStatus(
    req.params.userId,
    req.user.userId
  );
  res.status(200).json(new ApiResponse(200, result.message, { isActive: result.isActive }));
});

const changeUserRole = asyncHandler(async (req, res) => {
  const result = await adminService.changeUserRole(
    req.params.userId,
    req.body.role,
    req.user.userId
  );
  res.status(200).json(new ApiResponse(200, result.message, { user: result.user }));
});

module.exports = {
  getPlatformStats,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  changeUserRole,
};