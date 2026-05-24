const Destination = require('../models/Destination.model');
const Package = require('../models/Package.model');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');

const {
  getCache,
  setCache,
  deleteCache,
  deleteByPattern,
  cacheKeys,
} = require('../utils/cache');

// ─── Build query filters from request params ──────────────────────────────────
const buildDestinationQuery = (queryParams) => {
  const filter = { isActive: true };

  const {
    search,
    category,
    continent,
    isFeatured,
    minPrice,
    maxPrice,
  } = queryParams;

  // FIX 4: $text index search — sort by relevance score is handled in buildSortQuery
  if (search) {
    filter.$text = { $search: search };
  }

  if (category) filter.category = category;
  if (continent) filter.continent = continent;
  if (isFeatured === 'true') filter.isFeatured = true;

  if (minPrice || maxPrice) {
    filter.startingPrice = {};
    if (minPrice) filter.startingPrice.$gte = Number(minPrice);
    if (maxPrice) filter.startingPrice.$lte = Number(maxPrice);
  }

  return filter;
};

// ─── Build sort object from request params ────────────────────────────────────
const buildSortQuery = (sortParam, hasSearch = false) => {
  // FIX 4: When a text search is active, default sort is relevance score
  // { $meta: 'textScore' } tells MongoDB to rank by how well each doc matches
  // This is ignored if no $text filter is in the query
  if (hasSearch && !sortParam) {
    return { score: { $meta: 'textScore' } };
  }

  const sortOptions = {
    'rating-desc': { averageRating: -1 },
    'rating-asc':  { averageRating: 1 },
    'price-asc':   { startingPrice: 1 },
    'price-desc':  { startingPrice: -1 },
    newest:        { createdAt: -1 },
    oldest:        { createdAt: 1 },
    'name-asc':    { name: 1 },
    'name-desc':   { name: -1 },
  };

  return sortOptions[sortParam] || { isFeatured: -1, createdAt: -1 };
};

// ─── Get all destinations (search + filter + sort + paginate) ─────────────────
const getAllDestinations = async (queryParams) => {
  const { page = 1, limit = 12, sort } = queryParams;

  // FIX 1: Cache the destination list
  // We use the full queryParams as the cache key so each unique
  // search/filter/sort/page combo is cached independently
  const cacheKey = cacheKeys.destinationList(queryParams);
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const filter    = buildDestinationQuery(queryParams);
  const hasSearch = !!queryParams.search;
  const sortQuery = buildSortQuery(sort, hasSearch); // FIX 4: pass hasSearch flag

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * limitNum;

  // FIX 4: When sorting by text score we must project the score field
  // otherwise MongoDB throws: "can't have a sort key with $meta in a find"
  const projection = hasSearch && !sort
    ? { score: { $meta: 'textScore' }, __v: 0, createdBy: 0 }
    : { __v: 0, createdBy: 0 };

  const [destinations, total] = await Promise.all([
    Destination.find(filter, projection)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum),
    Destination.countDocuments(filter),
  ]);

  const result = {
    destinations,
    pagination: {
      total,
      page:    pageNum,
      limit:   limitNum,
      pages:   Math.ceil(total / limitNum),
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1,
    },
  };

  // FIX 7: Convert to plain objects before caching
  // Mongoose virtuals and circular refs cause issues with JSON.stringify
  const plainResult = JSON.parse(JSON.stringify(result));

  // Cache list results for 2 minutes — shorter TTL because filters vary widely
  await setCache(cacheKey, plainResult, 120);

  return result;
};

// ─── Get single destination by slug ──────────────────────────────────────────
const getDestinationBySlug = async (slug) => {
  const cacheKey = cacheKeys.destination(slug);

  // FIX 2: Cache stores plain objects — return them directly
  // No need to re-populate; all data was serialized when first cached
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const destination = await Destination.findOne({ slug, isActive: true })
    .populate({
      path:    'packages',
      match:   { isActive: true },
      select:  '-__v -createdBy',
      options: { sort: { price: 1 } },
    })
    .select('-__v');

  if (!destination) {
    throw new ApiError(404, `Destination "${slug}" not found`);
  }

  // FIX 7: Convert Mongoose document → plain JS object before caching
  // This ensures virtuals (effectivePrice, discountPercentage) are included
  // in the serialized output and Redis gets clean JSON with no circular refs
  const plainDestination = destination.toObject({ virtuals: true });

  // Cache for 5 minutes
  await setCache(cacheKey, plainDestination, 300);

  // Return the Mongoose doc (not the plain object) so callers can still
  // use Mongoose methods if needed — the plain object is only for the cache
  return destination;
};

// ─── Get featured destinations ────────────────────────────────────────────────
const getFeaturedDestinations = async (limit = 6) => {
  const cacheKey = cacheKeys.featured(limit);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const destinations = await Destination.find({ isFeatured: true, isActive: true })
    .sort({ averageRating: -1 })
    .limit(Math.min(20, limit))
    .select(
      'name slug country continent category coverImage averageRating reviewCount startingPrice currency'
    );

  // FIX 7: Convert to plain objects before caching
  const plain = JSON.parse(JSON.stringify(destinations));

  // Cache for 10 minutes — featured list changes infrequently
  await setCache(cacheKey, plain, 600);

  return destinations;
};

// ─── Get destinations by category ────────────────────────────────────────────
const getDestinationsByCategory = async (category, limit = 8) => {
  const validCategories = [
    'beach', 'mountain', 'city', 'desert',
    'forest', 'island', 'cultural', 'adventure',
  ];

  if (!validCategories.includes(category)) {
    throw new ApiError(400, `Invalid category: ${category}`);
  }

  // FIX 6: Cache category pages — they're shown on the landing page and
  // called on every visit with no user-specific data
  const cacheKey = `destinations:category:${category}:${limit}`;
  const cached   = await getCache(cacheKey);
  if (cached) return cached;

  const destinations = await Destination.find({ category, isActive: true })
    .sort({ averageRating: -1, isFeatured: -1 })
    .limit(limit)
    .select(
      'name slug country coverImage averageRating startingPrice currency'
    );

  // FIX 7: plain object before caching
  const plain = JSON.parse(JSON.stringify(destinations));

  // Cache for 5 minutes
  await setCache(cacheKey, plain, 300);

  return destinations;
};

// ─── Create destination (admin only) ─────────────────────────────────────────
const createDestination = async (data, adminId) => {
  const existing = await Destination.findOne({ slug: slugify(data.name) });
  if (existing) {
    throw new ApiError(409, `A destination named "${data.name}" already exists`);
  }

  const destination = await Destination.create({ ...data, createdBy: adminId });

  // FIX 5: On creation, only invalidate LIST and FEATURED caches
  // No need to nuke individual slug caches — the new destination
  // has no slug cache yet, and other destinations are unaffected
  await deleteByPattern('destinations:list:*');
  await deleteByPattern('destinations:featured:*');
  await deleteByPattern('destinations:category:*');

  return destination;
};

// ─── Update destination (admin only) ─────────────────────────────────────────
const updateDestination = async (id, data) => {
  // Fetch first so we have the OLD slug before it changes
  // This lets us delete the correct cache key
  const existing = await Destination.findById(id);
  if (!existing) throw new ApiError(404, 'Destination not found');

  if (data.name) {
    data.slug = slugify(data.name);
  }

  const destination = await Destination.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  // Clear the OLD slug cache (before name change) AND the new one
  await deleteCache(cacheKeys.destination(existing.slug));
  if (data.slug && data.slug !== existing.slug) {
    await deleteCache(cacheKeys.destination(data.slug));
  }

  // Clear list and featured caches — metadata may have changed
  await deleteByPattern('destinations:list:*');
  await deleteByPattern('destinations:featured:*');
  await deleteByPattern('destinations:category:*');

  return destination;
};

// ─── Delete destination (soft delete) ────────────────────────────────────────
const deleteDestination = async (id) => {
  const destination = await Destination.findById(id);
  if (!destination) throw new ApiError(404, 'Destination not found');

  await Destination.findByIdAndUpdate(id, { isActive: false });

  // Clear this destination's cache specifically + list caches
  await deleteCache(cacheKeys.destination(destination.slug));
  await deleteByPattern('destinations:list:*');
  await deleteByPattern('destinations:featured:*');
  await deleteByPattern('destinations:category:*');

  return { message: 'Destination deactivated successfully' };
};

// ─── Get all packages for a destination ──────────────────────────────────────
const getPackagesForDestination = async (destinationId) => {
  const destination = await Destination.findById(destinationId);
  if (!destination || !destination.isActive) {
    throw new ApiError(404, 'Destination not found');
  }

  const packages = await Package.find({ destination: destinationId, isActive: true })
    .sort({ price: 1 })
    .select('-__v -createdBy');

  return packages;
};

// ─── Create package (admin only) ──────────────────────────────────────────────
const createPackage = async (destinationId, data, adminId) => {
  const destination = await Destination.findById(destinationId);
  if (!destination || !destination.isActive) {
    throw new ApiError(404, 'Destination not found');
  }

  const pkg = await Package.create({
    ...data,
    destination: destinationId,
    createdBy:   adminId,
  });

  // FIX 3: Compute effective price inline — don't rely on the virtual
  // immediately after create() since the doc may not have virtuals attached
  // in all Mongoose versions. Explicit is always safer than implicit.
  const effectivePrice = pkg.discountPrice != null && pkg.discountPrice < pkg.price
    ? pkg.discountPrice
    : pkg.price;

  // Update destination's startingPrice if this package is cheaper
  if (!destination.startingPrice || effectivePrice < destination.startingPrice) {
    await Destination.findByIdAndUpdate(destinationId, {
      startingPrice: effectivePrice,
    });
  }

  // Invalidate this destination's cache — packages changed
  await deleteCache(cacheKeys.destination(destination.slug));
  await deleteByPattern('destinations:list:*');

  return pkg;
};

// ─── Update package (admin only) ──────────────────────────────────────────────
const updatePackage = async (packageId, data) => {
  const pkg = await Package.findByIdAndUpdate(
    packageId,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!pkg) throw new ApiError(404, 'Package not found');

  // Clear the parent destination's cache — package data changed
  const destination = await Destination.findById(pkg.destination);
  if (destination) {
    await deleteCache(cacheKeys.destination(destination.slug));
  }

  return pkg;
};

// ─── Delete package (soft delete) ────────────────────────────────────────────
const deletePackage = async (packageId) => {
  const pkg = await Package.findById(packageId);
  if (!pkg) throw new ApiError(404, 'Package not found');

  await Package.findByIdAndUpdate(packageId, { isActive: false });

  // Clear the parent destination's cache — package list changed
  const destination = await Destination.findById(pkg.destination);
  if (destination) {
    await deleteCache(cacheKeys.destination(destination.slug));
  }

  return { message: 'Package deactivated successfully' };
};

module.exports = {
  getAllDestinations,
  getDestinationBySlug,
  getFeaturedDestinations,
  getDestinationsByCategory,
  createDestination,
  updateDestination,
  deleteDestination,
  getPackagesForDestination,
  createPackage,
  updatePackage,
  deletePackage,
};