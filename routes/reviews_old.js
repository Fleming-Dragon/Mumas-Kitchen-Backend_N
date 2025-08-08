const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  getAllReviews
} = require('../controllers/reviewController');
const { validateReview } = require('../validators/reviewValidator');
const { reviewLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Sample reviews data
let reviews = [
  {
    id: 1,
    productId: 1,
    customerName: "Priya Sharma",
    rating: 5,
    comment:
      "Excellent quality jaggery! Pure and natural taste reminds me of my grandmother's cooking.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: 2,
    productId: 1,
    customerName: "Rajesh Kumar",
    rating: 4,
    comment: "Good quality product. Fast delivery and well packaged.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: 3,
    productId: 5,
    customerName: "Meera Patel",
    rating: 5,
    comment:
      "Love the coconut flavor! My kids enjoy these cubes as a healthy snack.",
    date: "2024-01-08",
    verified: true,
  },
  {
    id: 4,
    productId: 6,
    customerName: "Arjun Singh",
    rating: 5,
    comment: "Perfect cardamom flavor. Great for festive occasions!",
    date: "2024-01-05",
    verified: true,
  },
];

// Get reviews for a specific product
router.get("/product/:productId", (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const productReviews = reviews.filter(
      (review) => review.productId === productId
    );

    // Calculate average rating
    const averageRating =
      productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
          productReviews.length
        : 0;

    res.json({
      success: true,
      data: {
        reviews: productReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: productReviews.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
    });
  }
});

// Add a new review
router.post(
  "/product/:productId",
  [
    body("customerName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2-50 characters"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1-5"),
    body("comment")
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Comment must be between 10-500 characters"),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const productId = parseInt(req.params.productId);
      const { customerName, rating, comment } = req.body;

      const newReview = {
        id: reviews.length + 1,
        productId,
        customerName,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split("T")[0],
        verified: false, // New reviews start as unverified
      };

      reviews.push(newReview);

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: newReview,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to add review",
      });
    }
  }
);

// Get all reviews (admin functionality)
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: reviews,
      total: reviews.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
    });
  }
});

module.exports = router;
