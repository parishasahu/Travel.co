const Review = require('../models/Review.model');
const Booking = require('../models/Booking.model');
const Destination = require('../models/Destination.model');
const ApiError = require('../utils/ApiError');

// ─── Create review ────────────────────────────────────────────────────────────
const createReview = async (userId, destinationId, reviewData) => {
  // Rule 1: destination must exist and be active
  const destination = await Destination.findById(destinationId);
  if (!destination || !destination.isActive) {
    throw new ApiError(404, 'Destination not found');
  }

  // Rule 2: user must have a completed booking for this destination
  // This prevents fake reviews from users who never visited
  const verifiedBooking = await Booking.findOne({
    user: userId,
    destination: destinationId,
    status: 'completed',
  });

  if (!verifiedBooking) {
    throw new ApiError(
      403,
      'You can only review destinations you have visited with a completed booking'
    );
  }

  // Rule 3: one review per user per destination
  // The compound unique index will also catch this, but checking here
  // gives us a friendlier error message
  const existingReview = await Review.findOne({
    user: userId,
    destination: destinationId,
  });

  if (existingReview) {
    throw new ApiError(409, 'You have already reviewed this destination');
  }

  const review = await Review.create({
    user: userId,
    destination: destinationId,
    booking: verifiedBooking._id,
    ...reviewData,
  });

  // Populate user data for the response
  await review.populate('user', 'name avatar');

  // Note: averageRating auto-updates via the post-save hook
  return review;
};

// ─── Get reviews for a destination ───────────────────────────────────────────
const getDestinationReviews = async (destinationId, queryParams) => {
  const { page = 1, limit = 10, sort = 'newest' } = queryParams;

  const destination = await Destination.findById(destinationId);
  if (!destination) throw new ApiError(404, 'Destination not found');

  const sortOptions = {
    newest:      { createdAt: -1 },
    oldest:      { createdAt: 1 },
    'top-rated': { rating: -1 },
    helpful:     { helpfulVotes: -1 },
  };

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * limitNum;

  const filter = { destination: destinationId, status: 'active' };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name avatar profile.country createdAt')
      .select('-__v -flagReason'),
    Review.countDocuments(filter),
  ]);

  // Rating distribution breakdown (1★ through 5★)
  const distribution = await Review.aggregate([
    { $match: { destination: destination._id, status: 'active' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  return {
    reviews,
    distribution,
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

// ─── Get my reviews ────────────────────────────────────────────────────────────
const getMyReviews = async (userId) => {
  const reviews = await Review.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('destination', 'name country slug coverImage')
    .select('-__v');
  return reviews;
};

// ─── Update my review ─────────────────────────────────────────────────────────
const updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  // Only the owner can update their review
  if (review.user.toString() !== userId) {
    throw new ApiError(403, 'You can only edit your own reviews');
  }

  if (review.status === 'removed') {
    throw new ApiError(400, 'Cannot edit a removed review');
  }

  // Whitelist updatable fields
  const allowed = ['rating', 'title', 'comment', 'subRatings'];
  allowed.forEach((field) => {
    if (updateData[field] !== undefined) {
      review[field] = updateData[field];
    }
  });

  await review.save(); // triggers post-save hook → recalculates rating

  return review;
};

// ─── Delete my review ─────────────────────────────────────────────────────────
const deleteReview = async (reviewId, userId, userRole) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  // Owner or admin can delete
  if (userRole !== 'admin' && review.user.toString() !== userId) {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  // findOneAndDelete triggers our post-delete hook → recalculates rating
  await Review.findOneAndDelete({ _id: reviewId });

  return { message: 'Review deleted successfully' };
};

// ─── Admin: flag / unflag a review ────────────────────────────────────────────
const flagReview = async (reviewId, reason) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status: 'flagged', flagReason: reason },
    { new: true }
  );
  if (!review) throw new ApiError(404, 'Review not found');
  return review;
};

// ─── Admin: get all reviews with filters ──────────────────────────────────────
const getAllReviews = async (queryParams) => {
  const { status, destinationId, page = 1, limit = 20 } = queryParams;

  const filter = {};
  if (status) filter.status = status;
  if (destinationId) filter.destination = destinationId;

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email')
      .populate('destination', 'name country'),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    pagination: { total, page: pageNum, limit: limitNum,
      pages: Math.ceil(total / limitNum) },
  };
};

module.exports = {
  createReview,
  getDestinationReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  flagReview,
  getAllReviews,
};