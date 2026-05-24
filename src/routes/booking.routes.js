const express = require('express');
const router = express.Router();

const bc = require('../controllers/booking.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createBookingValidator,
  updateStatusValidator,
  cancelBookingValidator,
} = require('../validators/booking.validator');

// All booking routes require authentication
router.use(protect);

// ── User routes ───────────────────────────────────────────────────────────────
router.post(
  '/',
  createBookingValidator, validate,
  bc.createBooking
);

router.get('/my', bc.getMyBookings);
router.get('/:id', bc.getBookingById);

router.patch(
  '/:id/cancel',
  cancelBookingValidator, validate,
  bc.cancelBooking
);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get(
  '/admin/all',
  restrictTo('admin'),
  bc.getAllBookings
);

router.get(
  '/admin/stats',
  restrictTo('admin'),
  bc.getBookingStats
);

router.patch(
  '/admin/:id/status',
  restrictTo('admin'),
  updateStatusValidator, validate,
  bc.updateBookingStatus
);

module.exports = router;