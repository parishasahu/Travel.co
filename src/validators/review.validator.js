

const { body } = require('express-validator');

const createReviewValidator = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Comment must be between 20 and 1000 characters'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('subRatings.accommodation')
    .optional()
    .isFloat({ min: 1, max: 5 }).withMessage('Accommodation rating must be 1-5'),

  body('subRatings.valueForMoney')
    .optional()
    .isFloat({ min: 1, max: 5 }).withMessage('Value rating must be 1-5'),
];

module.exports = { createReviewValidator };