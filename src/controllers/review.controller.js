const reviewService = require('../services/review.service');
const ApiResponse   = require('../utils/ApiResponse');
const asyncHandler  = require('../utils/asyncHandler');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(
    req.user.userId,
    req.params.destinationId,
    req.body
  );
  res.status(201).json(new ApiResponse(201, 'Review submitted successfully', { review }));
});

const getDestinationReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getDestinationReviews(
    req.params.destinationId,
    req.query
  );
  res.status(200).json(new ApiResponse(200, 'Reviews fetched', result));
});

const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getMyReviews(req.user.userId);
  res.status(200).json(new ApiResponse(200, 'Your reviews fetched', { reviews }));
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.reviewId,
    req.user.userId,
    req.body
  );
  res.status(200).json(new ApiResponse(200, 'Review updated', { review }));
});

const deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(
    req.params.reviewId,
    req.user.userId,
    req.user.role
  );
  res.status(200).json(new ApiResponse(200, result.message));
});

const flagReview = asyncHandler(async (req, res) => {
  const review = await reviewService.flagReview(
    req.params.reviewId,
    req.body.reason
  );
  res.status(200).json(new ApiResponse(200, 'Review flagged', { review }));
});

const getAllReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getAllReviews(req.query);
  res.status(200).json(new ApiResponse(200, 'All reviews fetched', result));
});

module.exports = {
  createReview, getDestinationReviews, getMyReviews,
  updateReview, deleteReview, flagReview, getAllReviews,
};