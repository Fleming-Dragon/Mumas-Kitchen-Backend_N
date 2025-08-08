const express = require("express");
const router = express.Router();
const {
  getTodaysMeals,
  getMealCategories,
} = require("../controllers/publicMealsController");
const { apiLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting
router.use(apiLimiter);

// @route   GET /api/public/today-meals
// @desc    Get today's active meals for public display
// @access  Public
router.get("/today-meals", getTodaysMeals);

// @route   GET /api/public/meal-categories
// @desc    Get available meal categories for today
// @access  Public
router.get("/meal-categories", getMealCategories);

module.exports = router;
