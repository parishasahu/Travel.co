const { body } = require('express-validator');

const createBookingValidator = [
  body('packageId')
    .notEmpty().withMessage('Package ID is required')
    .isMongoId().withMessage('Invalid package ID format'),

  body('travelDate')
    .notEmpty().withMessage('Travel date is required')
    .isISO8601().withMessage('Travel date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Travel date must be in the future');
      }
      return true;
    }),

  body('guests.adults')
    .notEmpty().withMessage('Number of adults is required')
    .isInt({ min: 1 }).withMessage('At least 1 adult is required'),

  body('guests.children')
    .optional()
    .isInt({ min: 0 }).withMessage('Children count cannot be negative'),

  body('specialRequests')
    .optional()
    .isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters'),
];

const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
];

const cancelBookingValidator = [
  body('reason')
    .optional()
    .isLength({ max: 300 }).withMessage('Reason cannot exceed 300 characters'),
];

module.exports = {
  createBookingValidator,
  updateStatusValidator,
  cancelBookingValidator,
};