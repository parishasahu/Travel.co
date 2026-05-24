const User        = require('../models/User.model');
const Destination = require('../models/Destination.model');
const Booking     = require('../models/Booking.model');
const Review      = require('../models/Review.model');
const ApiError    = require('../utils/ApiError');

// ─── Platform-wide stats (admin dashboard home) ───────────────────────────────
const getPlatformStats = async () => {
  // Run all stat queries in parallel — single round-trip latency
  const [
    totalUsers,
    activeUsers,
    totalDestinations,
    totalBookings,
    bookingsByStatus,
    revenueData,
    recentBookings,
    topDestinations,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Destination.countDocuments({ isActive: true }),
    Booking.countDocuments(),

    // Booking counts grouped by status
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Revenue from confirmed + completed bookings
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
    ]),

    // Last 5 bookings for activity feed
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email avatar')
      .populate('destination', 'name country'),

    // Top 5 destinations by booking count
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: '$destination', bookingCount: { $sum: 1 },
                  revenue: { $sum: '$totalPrice' } } },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'destinations',
          localField: '_id',
          foreignField: '_id',
          as: 'destination',
      }},
      { $unwind: '$destination' },
      { $project: {
          name:         '$destination.name',
          country:      '$destination.country',
          coverImage:   '$destination.coverImage',
          bookingCount: 1,
          revenue:      1,
      }},
    ]),
  ]);

  // Format bookingsByStatus into a clean object
  const statusMap = {};
  bookingsByStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

  return {
    users: {
      total:  totalUsers,
      active: activeUsers,
    },
    destinations: {
      total: totalDestinations,
    },
    bookings: {
      total:     totalBookings,
      pending:   statusMap.pending   || 0,
      confirmed: statusMap.confirmed || 0,
      completed: statusMap.completed || 0,
      cancelled: statusMap.cancelled || 0,
    },
    revenue: {
      total: revenueData[0]?.total || 0,
      fromBookings: revenueData[0]?.count || 0,
    },
    recentBookings,
    topDestinations,
  };
};

// ─── Get all users (with search + filter + pagination) ────────────────────────
const getAllUsers = async (queryParams) => {
  const { search, role, isActive, page = 1, limit = 20 } = queryParams;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    // Search by name or email using regex
    filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v'),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

// ─── Get single user with full details ────────────────────────────────────────
const getUserById = async (userId) => {
  const [user, bookingStats] = await Promise.all([
    User.findById(userId).select('-__v'),
    Booking.aggregate([
      { $match: { user: new (require('mongoose').Types.ObjectId)(userId) } },
      { $group: {
          _id:          '$status',
          count:        { $sum: 1 },
          totalSpent:   { $sum: '$totalPrice' },
      }},
    ]),
  ]);

  if (!user) throw new ApiError(404, 'User not found');

  return { user, bookingStats };
};

// ─── Toggle user active status ────────────────────────────────────────────────
const toggleUserStatus = async (userId, adminId) => {
  // Prevent admin from deactivating themselves
  if (userId === adminId) {
    throw new ApiError(400, 'You cannot change your own account status');
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = !user.isActive;
  await user.save();

  return {
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    isActive: user.isActive,
  };
};

// ─── Change user role (admin only) ────────────────────────────────────────────
const changeUserRole = async (userId, newRole, adminId) => {
  if (userId === adminId) {
    throw new ApiError(400, 'You cannot change your own role');
  }

  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(newRole)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');

  return { message: `User role changed to ${newRole}`, user };
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  changeUserRole,
};