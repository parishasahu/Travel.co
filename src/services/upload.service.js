const cloudinary = require('../config/cloudinary');
const ApiError   = require('../utils/ApiError');

// ─── Upload a single image buffer to Cloudinary ───────────────────────────────
const uploadImage = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      folder:         options.folder || 'luxury-travel',
      resource_type:  'image',
      // Auto-optimize format (WebP for modern browsers, JPEG fallback)
      fetch_format:   'auto',
      // Auto compress quality intelligently
      quality:        'auto',
      // Transformations applied at upload time — saves bandwidth on every request
      transformation: options.transformation || [
        {
          width:  1920,
          height: 1080,
          crop:   'limit',  // never upscale, only downscale if larger
        },
      ],
    };

    const uploadOptions = { ...defaultOptions, ...options };

    // upload_stream accepts a buffer and pipes to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(new ApiError(500, `Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url:       result.secure_url,  // always use HTTPS URL
            publicId:  result.public_id,
            width:     result.width,
            height:    result.height,
            format:    result.format,
            bytes:     result.bytes,
          });
        }
      }
    );

    // End the stream with our buffer
    uploadStream.end(buffer);
  });
};

// ─── Upload multiple images ───────────────────────────────────────────────────
const uploadMultipleImages = async (files, folder) => {
  const uploadPromises = files.map((file) =>
    uploadImage(file.buffer, { folder })
  );
  // Run all uploads in parallel — dramatically faster than sequential
  return Promise.all(uploadPromises);
};

// ─── Delete an image from Cloudinary ─────────────────────────────────────────
// Always delete old images when replacing them — don't litter Cloudinary
const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Log but don't throw — a failed delete shouldn't break the main operation
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error.message);
  }
};

// ─── Generate thumbnail URL from existing Cloudinary URL ─────────────────────
// Cloudinary can transform images on-the-fly via URL parameters
// This is useful for generating card thumbnails without re-uploading
const getThumbnailUrl = (originalUrl, width = 400, height = 300) => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) return originalUrl;

  // Insert transformation into the URL
  return originalUrl.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
  );
};

module.exports = { uploadImage, uploadMultipleImages, deleteImage, getThumbnailUrl };