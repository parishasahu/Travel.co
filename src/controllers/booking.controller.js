const bookingService = require('../services/booking.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/v1/bookings
const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.userId, req.body);
  res.status(201).json(
    new ApiResponse(201, 'Booking created successfully', { booking })
  );
});

// GET /api/v1/bookings/my
const getMyBookings = asyncHandler(async (req, res) => {
  const result = await bookingService.getMyBookings(req.user.userId, req.query);
  res.status(200).json(
    new ApiResponse(200, 'Your bookings fetched successfully', result)
  );
});

// GET /api/v1/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(
    req.params.id,
    req.user.userId,
    req.user.role
  );
  res.status(200).json(
    new ApiResponse(200, 'Booking fetched successfully', { booking })
  );
});

// PATCH /api/v1/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(
    req.params.id,
    req.user.userId,
    req.user.role,
    req.body.reason
  );
  res.status(200).json(
    new ApiResponse(200, 'Booking cancelled successfully', { booking })
  );
});

// ── Admin controllers ─────────────────────────────────────────────────────────

// GET /api/v1/bookings/admin/all
const getAllBookings = asyncHandler(async (req, res) => {
  const result = await bookingService.getAllBookings(req.query);
  res.status(200).json(
    new ApiResponse(200, 'All bookings fetched', result)
  );
});

// PATCH /api/v1/bookings/admin/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json(
      new ApiResponse(400, 'Status field is required')
    );
  }
  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    status,
    req.user.userId
  );
  res.status(200).json(
    new ApiResponse(200, `Booking status updated to "${status}"`, { booking })
  );
});

// GET /api/v1/bookings/admin/stats
const getBookingStats = asyncHandler(async (req, res) => {
  const stats = await bookingService.getBookingStats();
  res.status(200).json(
    new ApiResponse(200, 'Booking stats fetched', stats)
  );
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
};