// routes/authRoutes.js — Q6: Login & Signup APIs
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { signup, login, getMe } = require('../controllers/authController');

// Signup validation
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// POST /api/auth/signup  → register
router.post('/signup', signupValidation, signup);

// POST /api/auth/login   → login
router.post('/login', login);

// GET  /api/auth/me      → current user (protected)
router.get('/me', protect, getMe);

module.exports = router;
