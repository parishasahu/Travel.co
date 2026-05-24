const express = require('express');
const router  = express.Router({ mergeParams: true }); // mergeParams to access :destinationId

const rc = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createReviewValidator } = require('../validators/review.validator');

// Public
router.get('/', rc.getDestinationReviews);

// Authenticated users
router.use(protect);
router.post('/', createReviewValidator, validate, rc.createReview);
router.get('/my', rc.getMyReviews);
router.patch('/:reviewId', rc.updateReview);
router.delete('/:reviewId', rc.deleteReview);

// Admin
router.get('/admin/all', restrictTo('admin'), rc.getAllReviews);
router.patch('/:reviewId/flag', restrictTo('admin'), rc.flagReview);

module.exports = router;