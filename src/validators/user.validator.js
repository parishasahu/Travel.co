const { body, param } = require('express-validator');

// Validator for updating profile
const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('profile.bio')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Bio cannot exceed 300 characters'),

  body('profile.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('profile.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Country name is invalid'),

  body('profile.travelStyle')
    .optional()
    .isIn(['luxury', 'adventure', 'cultural', 'relaxation', 'budget'])
    .withMessage('Invalid travel style'),

  body('profile.languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
];

// Validator for changing password
const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Validator for wishlist / saved destination toggle
const destinationIdValidator = [
  param('destinationId')
    .isMongoId()
    .withMessage('Invalid destination ID format'),
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator,
  destinationIdValidator,
};