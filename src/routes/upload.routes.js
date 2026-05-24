const express = require('express');
const router  = express.Router();

const uploadController = require('../controllers/upload.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All upload routes require auth
router.use(protect);

// User: upload own avatar
router.post(
  '/avatar',
  upload.single('avatar'),  // 'avatar' = form field name
  uploadController.uploadAvatar
);

// Admin: upload destination images
router.post(
  '/destination/:id/cover',
  restrictTo('admin'),
  upload.single('coverImage'),
  uploadController.uploadDestinationCover
);

router.post(
  '/destination/:id/images',
  restrictTo('admin'),
  upload.array('images', 10),  // up to 10 files, field name 'images'
  uploadController.uploadDestinationImages
);

module.exports = router;