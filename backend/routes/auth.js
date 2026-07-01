const express = require('express');
const router = express.Router();

const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimiters');

// POST /api/auth/login — authenticate an admin (public, brute-force limited)
router.post('/login', loginLimiter, validateLogin, login);

// GET /api/auth/me — current logged-in admin (protected)
router.get('/me', protect, getMe);

module.exports = router;
