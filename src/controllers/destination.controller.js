const destinationService = require('../services/destination.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/destinations
const getAllDestinations = asyncHandler(async (req, res) => {
  const result = await destinationService.getAllDestinations(req.query);
  res.status(200).json(
    new ApiResponse(200, 'Destinations fetched successfully', result)
  );
});

// GET /api/v1/destinations/featured
const getFeaturedDestinations = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const destinations = await destinationService.getFeaturedDestinations(limit);
  res.status(200).json(
    new ApiResponse(200, 'Featured destinations fetched', { destinations })
  );
});

// GET /api/v1/destinations/category/:category
const getDestinationsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 8;
  const destinations = await destinationService.getDestinationsByCategory(category, limit);
  res.status(200).json(
    new ApiResponse(200, `${category} destinations fetched`, { destinations })
  );
});

// GET /api/v1/destinations/:slug
const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await destinationService.getDestinationBySlug(req.params.slug);
  res.status(200).json(
    new ApiResponse(200, 'Destination fetched successfully', { destination })
  );
});

// POST /api/v1/destinations  (admin only)
const createDestination = asyncHandler(async (req, res) => {
  const destination = await destinationService.createDestination(
    req.body,
    req.user.userId
  );
  res.status(201).json(
    new ApiResponse(201, 'Destination created successfully', { destination })
  );
});

// PATCH /api/v1/destinations/:id  (admin only)
const updateDestination = asyncHandler(async (req, res) => {
  const destination = await destinationService.updateDestination(
    req.params.id,
    req.body
  );
  res.status(200).json(
    new ApiResponse(200, 'Destination updated successfully', { destination })
  );
});

// DELETE /api/v1/destinations/:id  (admin only)
const deleteDestination = asyncHandler(async (req, res) => {
  const result = await destinationService.deleteDestination(req.params.id);
  res.status(200).json(new ApiResponse(200, result.message));
});

// GET /api/v1/destinations/:id/packages
const getPackagesForDestination = asyncHandler(async (req, res) => {
  const packages = await destinationService.getPackagesForDestination(req.params.id);
  res.status(200).json(
    new ApiResponse(200, 'Packages fetched successfully', { packages })
  );
});

// POST /api/v1/destinations/:id/packages  (admin only)
const createPackage = asyncHandler(async (req, res) => {
  const pkg = await destinationService.createPackage(
    req.params.id,
    req.body,
    req.user.userId
  );
  res.status(201).json(
    new ApiResponse(201, 'Package created successfully', { package: pkg })
  );
});

// PATCH /api/v1/packages/:packageId  (admin only)
const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await destinationService.updatePackage(req.params.packageId, req.body);
  res.status(200).json(
    new ApiResponse(200, 'Package updated successfully', { package: pkg })
  );
});

// DELETE /api/v1/packages/:packageId  (admin only)
const deletePackage = asyncHandler(async (req, res) => {
  const result = await destinationService.deletePackage(req.params.packageId);
  res.status(200).json(new ApiResponse(200, result.message));
});

module.exports = {
  getAllDestinations,
  getFeaturedDestinations,
  getDestinationsByCategory,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
  getPackagesForDestination,
  createPackage,
  updatePackage,
  deletePackage,
};