// routes/aiRoutes.js — Q5: AI Integration Routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getRecommendation, rankEmployees } = require('../controllers/aiController');

// POST /api/ai/recommend  → get AI recommendation for one employee
router.post('/recommend', protect, getRecommendation);

// POST /api/ai/rank       → rank multiple employees with AI
router.post('/rank', protect, rankEmployees);

module.exports = router;
