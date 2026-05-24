const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  updateProfileValidator,
  changePasswordValidator,
  destinationIdValidator,
} = require('../validators/user.validator');

// All user routes require authentication
// Apply protect once at the router level — every route below is protected
router.use(protect);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get('/me', userController.getMyProfile);
router.patch('/me', updateProfileValidator, validate, userController.updateMyProfile);
router.delete('/me', userController.deactivateAccount);

// ── Password ──────────────────────────────────────────────────────────────────
router.patch(
  '/me/change-password',
  changePasswordValidator,
  validate,
  userController.changePassword
);

// ── Wishlist ──────────────────────────────────────────────────────────────────
router.get('/me/wishlist', userController.getMyWishlist);
router.post(
  '/me/wishlist/:destinationId',
  destinationIdValidator,
  validate,
  userController.toggleWishlist
);

// ── Saved destinations ────────────────────────────────────────────────────────
router.get('/me/saved', userController.getMySavedDestinations);
router.post(
  '/me/saved/:destinationId',
  destinationIdValidator,
  validate,
  userController.toggleSavedDestination
);

module.exports = router;