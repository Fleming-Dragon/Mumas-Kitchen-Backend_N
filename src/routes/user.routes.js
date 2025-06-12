const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Admin only routes
router.get("/admin", authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
});

// Regular user route
router.get("/profile", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile access",
    user: req.user,
  });
});

module.exports = router;
