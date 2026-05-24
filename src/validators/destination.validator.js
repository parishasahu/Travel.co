const { body, param, query } = require('express-validator');

const createDestinationValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),

  body('continent')
    .notEmpty().withMessage('Continent is required')
    .isIn(['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'])
    .withMessage('Invalid continent'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['beach', 'mountain', 'city', 'desert', 'forest', 'island', 'cultural', 'adventure'])
    .withMessage('Invalid category'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description too long'),

  body('coverImage')
    .notEmpty().withMessage('Cover image URL is required')
    .isURL().withMessage('Cover image must be a valid URL'),
];

const createPackageValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Package title is required'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('duration.days')
    .isInt({ min: 1 }).withMessage('Duration days must be at least 1'),

  body('duration.nights')
    .isInt({ min: 0 }).withMessage('Duration nights cannot be negative'),

  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('type')
    .notEmpty().withMessage('Package type is required')
    .isIn(['resort', 'villa', 'safari', 'cruise', 'adventure', 'cultural', 'honeymoon'])
    .withMessage('Invalid package type'),

  body('maxGroupSize')
    .optional()
    .isInt({ min: 1 }).withMessage('Max group size must be at least 1'),
];

const destinationQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),

  query('category')
    .optional()
    .isIn(['beach', 'mountain', 'city', 'desert', 'forest', 'island', 'cultural', 'adventure'])
    .withMessage('Invalid category filter'),

  query('sort')
    .optional()
    .isIn(['rating-desc', 'rating-asc', 'price-asc', 'price-desc', 'newest', 'oldest', 'name-asc', 'name-desc'])
    .withMessage('Invalid sort option'),
];

module.exports = {
  createDestinationValidator,
  createPackageValidator,
  destinationQueryValidator,
};