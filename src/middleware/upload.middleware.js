const multer    = require('multer');
const ApiError  = require('../utils/ApiError');

// Store files in MEMORY (buffer) — never on disk
// The buffer is passed directly to Cloudinary's upload stream
const storage = multer.memoryStorage();

// File filter — images only, strict type checking
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);  // accept the file
  } else {
    cb(
      new ApiError(400, 'Invalid file type. Only JPEG, PNG, and WebP images are allowed'),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 10,                  // max 10 files per request
  },
});

module.exports = upload;