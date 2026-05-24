const express = require('express');
const router  = express.Router();

const adminController  = require('../controllers/admin.controller');
const reviewController = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All admin routes: must be logged in AND must be admin
router.use(protect, restrictTo('admin'));

// ── Dashboard ──────────────────────────────────────────────────────────────
router.get('/stats', adminController.getPlatformStats);

// ── User management ────────────────────────────────────────────────────────
router.get('/users',                  adminController.getAllUsers);
router.get('/users/:userId',          adminController.getUserById);
router.patch('/users/:userId/toggle', adminController.toggleUserStatus);
router.patch('/users/:userId/role',   adminController.changeUserRole);

// ── Review moderation ──────────────────────────────────────────────────────
router.get('/reviews',                reviewController.getAllReviews);
router.patch('/reviews/:reviewId/flag', reviewController.flagReview);
router.delete('/reviews/:reviewId',   reviewController.deleteReview);

module.exports = router;