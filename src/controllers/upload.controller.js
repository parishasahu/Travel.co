const uploadService     = require('../services/upload.service');
const Destination       = require('../models/Destination.model');
const ApiResponse       = require('../utils/ApiResponse');
const asyncHandler      = require('../utils/asyncHandler');
const ApiError          = require('../utils/ApiError');

// POST /api/v1/upload/destination/:id/cover
// Upload or replace the cover image for a destination
const uploadDestinationCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  const destination = await Destination.findById(req.params.id);
  if (!destination) throw new ApiError(404, 'Destination not found');

  // Upload new image
  const result = await uploadService.uploadImage(req.file.buffer, {
    folder: `luxury-travel/destinations/${destination.slug}`,
    transformation: [{ width: 1920, height: 1080, crop: 'fill', gravity: 'auto' }],
  });

  // Update destination with new cover image URL
  destination.coverImage = result.url;
  await destination.save();

  res.status(200).json(
    new ApiResponse(200, 'Cover image uploaded successfully', {
      coverImage: result.url,
      details: result,
    })
  );
});

// POST /api/v1/upload/destination/:id/images
// Upload multiple gallery images for a destination
const uploadDestinationImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No image files provided');
  }

  const destination = await Destination.findById(req.params.id);
  if (!destination) throw new ApiError(404, 'Destination not found');

  // Check capacity before uploading
  const currentCount = destination.images.length;
  const newCount     = req.files.length;
  if (currentCount + newCount > 10) {
    throw new ApiError(
      400,
      `Cannot add ${newCount} images. Destination already has ${currentCount}/10 images.`
    );
  }

  // Upload all in parallel
  const results = await uploadService.uploadMultipleImages(
    req.files,
    `luxury-travel/destinations/${destination.slug}/gallery`
  );

  const newUrls = results.map((r) => r.url);

  // Push new URLs into the images array
  destination.images.push(...newUrls);
  await destination.save();

  res.status(200).json(
    new ApiResponse(200, `${newUrls.length} images uploaded successfully`, {
      images: destination.images,
      uploaded: newUrls,
    })
  );
});

// POST /api/v1/upload/avatar
// Upload user avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided');

  const User = require('../models/User.model');
  const user = await User.findById(req.user.userId);
  if (!user) throw new ApiError(404, 'User not found');

  const result = await uploadService.uploadImage(req.file.buffer, {
    folder: 'luxury-travel/avatars',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // smart face crop
    ],
  });

  user.avatar = result.url;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, 'Avatar uploaded successfully', { avatar: result.url })
  );
});

module.exports = {
  uploadDestinationCover,
  uploadDestinationImages,
  uploadAvatar,
};