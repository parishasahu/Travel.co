const Booking = require('../models/Booking.model');
const Package = require('../models/Package.model');
const Destination = require('../models/Destination.model');
const ApiError = require('../utils/ApiError');

// ─── Helper: validate business rules before creating a booking ────────────────
const validateBookingRules = async (pkg, destination, travelDate, guests) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // strip time component for date comparison

  // Rule 1: travel date must be in the future
  if (new Date(travelDate) <= today) {
    throw new ApiError(400, 'Travel date must be in the future');
  }

  // Rule 2: total guests cannot exceed package max group size
  const totalGuests = guests.adults + (guests.children || 0);
  if (totalGuests > pkg.maxGroupSize) {
    throw new ApiError(
      400,
      `This package allows a maximum of ${pkg.maxGroupSize} guests. You requested ${totalGuests}.`
    );
  }

  // Rule 3: package must be active
  if (!pkg.isActive) {
    throw new ApiError(400, 'This package is no longer available');
  }

  // Rule 4: destination must be active
  if (!destination.isActive) {
    throw new ApiError(400, 'This destination is no longer available');
  }
};

// ─── Helper: check for double booking ────────────────────────────────────────
const checkDoubleBooking = async (userId, packageId, travelDate) => {
  const startOfDay = new Date(travelDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(travelDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await Booking.findOne({
    user: userId,
    package: packageId,
    travelDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['pending', 'confirmed'] }, // cancelled bookings don't count
  });

  if (existing) {
    throw new ApiError(
      409,
      `You already have a booking for this package on ${new Date(travelDate).toDateString()}`
    );
  }
};

// ─── Create booking ───────────────────────────────────────────────────────────
const createBooking = async (userId, bookingData) => {
  const { packageId, travelDate, guests, specialRequests } = bookingData;

  // Fetch the package with its destination populated
  const pkg = await Package.findById(packageId).populate('destination');
  if (!pkg) throw new ApiError(404, 'Package not found');

  const destination = pkg.destination;
  if (!destination) throw new ApiError(404, 'Destination not found');

  // Run all business rule validations
  await validateBookingRules(pkg, destination, travelDate, guests);

  // Check for double booking
  await checkDoubleBooking(userId, packageId, travelDate);

  // Calculate total price
  // effectivePrice is the virtual we defined: discountPrice if set, else price
  const pricePerPerson = pkg.effectivePrice;
  const totalGuests = guests.adults + (guests.children || 0);
  const totalPrice = pricePerPerson * totalGuests;

  // Calculate return date from travel date + package duration
  const returnDate = new Date(travelDate);
  returnDate.setDate(returnDate.getDate() + pkg.duration.days);

  // Build the snapshot — locked forever at this moment
  const packageSnapshot = {
    title: pkg.title,
    duration: pkg.duration,
    type: pkg.type,
    inclusions: pkg.inclusions,
    coverImage: pkg.coverImage,
    priceAtBooking: pricePerPerson,
  };

  const destinationSnapshot = {
    name: destination.name,
    country: destination.country,
    continent: destination.continent,
    coverImage: destination.coverImage,
    slug: destination.slug,
  };

  const booking = await Booking.create({
    user: userId,
    package: packageId,
    destination: destination._id,
    packageSnapshot,
    destinationSnapshot,
    guests,
    travelDate,
    returnDate,
    totalPrice,
    currency: pkg.currency || 'USD',
    specialRequests: specialRequests || null,
  });

  return booking;
};

// ─── Get my bookings (with filtering + pagination) ────────────────────────────
const getMyBookings = async (userId, queryParams) => {
  const { status, page = 1, limit = 10 } = queryParams;

  const filter = { user: userId };
  if (status) filter.status = status;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })   // newest first
      .skip(skip)
      .limit(limitNum)
      // Only populate fields we need — never over-populate
      .populate('package', 'title type duration')
      .populate('destination', 'name country slug coverImage')
      .select('-__v'),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1,
    },
  };
};

// ─── Get single booking by ID ─────────────────────────────────────────────────
const getBookingById = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId)
    .populate('user', 'name email avatar')
    .populate('package', 'title type duration price discountPrice')
    .populate('destination', 'name country continent slug coverImage')
    .select('-__v');

  if (!booking) throw new ApiError(404, 'Booking not found');

  // Users can only see their own bookings — admins can see all
  if (userRole !== 'admin' && booking.user._id.toString() !== userId) {
    throw new ApiError(403, 'You do not have permission to view this booking');
  }

  return booking;
};

// ─── Cancel booking ────────────────────────────────────────────────────────────
const cancelBooking = async (bookingId, userId, userRole, reason) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // Authorization: owner or admin
  if (userRole !== 'admin' && booking.user.toString() !== userId) {
    throw new ApiError(403, 'You do not have permission to cancel this booking');
  }

  // Business rule: only pending or confirmed bookings can be cancelled
  if (!booking.isCancellable) {
    throw new ApiError(
      400,
      `Cannot cancel a booking with status "${booking.status}"`
    );
  }

  // Update status and record cancellation details
  booking.status = 'cancelled';
  booking.cancellation = {
    cancelledAt: new Date(),
    cancelledBy: userId,
    reason: reason || 'No reason provided',
  };

  await booking.save();
  return booking;
};

// ─── Admin: get all bookings ───────────────────────────────────────────────────
const getAllBookings = async (queryParams) => {
  const { status, userId, destinationId, page = 1, limit = 20 } = queryParams;

  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.user = userId;
  if (destinationId) filter.destination = destinationId;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email avatar')
      .populate('destination', 'name country')
      .select('-__v'),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1,
    },
  };
};

// ─── Admin: update booking status ─────────────────────────────────────────────
const updateBookingStatus = async (bookingId, newStatus, adminId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // Enforce valid state transitions
  // The state machine rules live here — not in the controller
  const validTransitions = {
    pending:   ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [],      // terminal — no transitions allowed
    completed: [],      // terminal — no transitions allowed
  };

  const allowedNext = validTransitions[booking.status];
  if (!allowedNext.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot transition booking from "${booking.status}" to "${newStatus}". ` +
      `Allowed transitions: ${allowedNext.join(', ') || 'none'}`
    );
  }

  booking.status = newStatus;

  // If cancelling via admin status update, record it
  if (newStatus === 'cancelled') {
    booking.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: adminId,
      reason: 'Cancelled by admin',
    };
  }

  // If confirming, mark as paid (simplified — Stripe handles this on Day 7)
  if (newStatus === 'confirmed') {
    booking.payment.status = 'paid';
    booking.payment.paidAt = new Date();
  }

  await booking.save();
  return booking;
};

// ─── Get booking stats (admin dashboard) ──────────────────────────────────────
const getBookingStats = async () => {
  // MongoDB aggregation pipeline — groups and counts in one DB call
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: '$status',             // group by status field
        count: { $sum: 1 },         // count documents per group
        revenue: { $sum: '$totalPrice' }, // sum revenue per group
      },
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        revenue: 1,
        _id: 0,
      },
    },
  ]);

  // Total revenue from confirmed + completed bookings only
  const totalRevenue = await Booking.aggregate([
    {
      $match: { status: { $in: ['confirmed', 'completed'] } },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    byStatus: stats,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalConfirmedBookings: totalRevenue[0]?.count || 0,
  };
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
};