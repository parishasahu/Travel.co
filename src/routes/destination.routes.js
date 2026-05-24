const express = require('express');
const router = express.Router();

const dc = require('../controllers/destination.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createDestinationValidator,
  createPackageValidator,
  destinationQueryValidator,
} = require('../validators/destination.validator');

// ── Public routes — no auth needed ───────────────────────────────────────────
router.get('/',           destinationQueryValidator, validate, dc.getAllDestinations);
router.get('/featured',   dc.getFeaturedDestinations);
router.get('/category/:category', dc.getDestinationsByCategory);
router.get('/:slug',      dc.getDestinationBySlug);
router.get('/:id/packages', dc.getPackagesForDestination);

// ── Admin-only routes ─────────────────────────────────────────────────────────
// protect verifies JWT, restrictTo('admin') checks the role
router.post(
  '/',
  protect, restrictTo('admin'),
  createDestinationValidator, validate,
  dc.createDestination
);

router.patch(
  '/:id',
  protect, restrictTo('admin'),
  dc.updateDestination
);

router.delete(
  '/:id',
  protect, restrictTo('admin'),
  dc.deleteDestination
);

router.post(
  '/:id/packages',
  protect, restrictTo('admin'),
  createPackageValidator, validate,
  dc.createPackage
);

// Package-level routes (not nested under destination)
router.patch('/packages/:packageId', protect, restrictTo('admin'), dc.updatePackage);
router.delete('/packages/:packageId', protect, restrictTo('admin'), dc.deletePackage);

module.exports = router;