const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { signupValidator, loginValidator } = require('../validators/auth.validator');

// Public routes
router.post('/signup', signupValidator, validate, authController.signup);
router.post('/login',  loginValidator,  validate, authController.login);

// Protected route — notice the middleware chain:
// protect runs first, then the controller
router.get('/me', protect, authController.getMe);

module.exports = router;