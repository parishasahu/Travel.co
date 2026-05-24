const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/users/me
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getMyProfile(req.user.userId);
  res.status(200).json(new ApiResponse(200, 'Profile fetched successfully', { user }));
});

// PATCH /api/v1/users/me
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateMyProfile(req.user.userId, req.body);
  res.status(200).json(new ApiResponse(200, 'Profile updated successfully', { user }));
});

// PATCH /api/v1/users/me/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user.userId, {
    currentPassword,
    newPassword,
  });
  res.status(200).json(new ApiResponse(200, result.message));
});

// POST /api/v1/users/me/wishlist/:destinationId
const toggleWishlist = asyncHandler(async (req, res) => {
  const result = await userService.toggleWishlist(
    req.user.userId,
    req.params.destinationId
  );
  const message =
    result.action === 'added'
      ? 'Destination added to wishlist'
      : 'Destination removed from wishlist';
  res.status(200).json(new ApiResponse(200, message, result));
});

// POST /api/v1/users/me/saved/:destinationId
const toggleSavedDestination = asyncHandler(async (req, res) => {
  const result = await userService.toggleSavedDestination(
    req.user.userId,
    req.params.destinationId
  );
  const message =
    result.action === 'added'
      ? 'Destination saved'
      : 'Destination removed from saved';
  res.status(200).json(new ApiResponse(200, message, result));
});

// GET /api/v1/users/me/wishlist
const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.getMyWishlist(req.user.userId);
  res.status(200).json(
    new ApiResponse(200, 'Wishlist fetched successfully', { wishlist })
  );
});

// GET /api/v1/users/me/saved
const getMySavedDestinations = asyncHandler(async (req, res) => {
  const saved = await userService.getMySavedDestinations(req.user.userId);
  res.status(200).json(
    new ApiResponse(200, 'Saved destinations fetched', { savedDestinations: saved })
  );
});

// DELETE /api/v1/users/me
const deactivateAccount = asyncHandler(async (req, res) => {
  const result = await userService.deactivateAccount(req.user.userId);
  res.status(200).json(new ApiResponse(200, result.message));
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  toggleWishlist,
  toggleSavedDestination,
  getMyWishlist,
  getMySavedDestinations,
  deactivateAccount,
};