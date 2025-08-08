const express = require("express");
const router = express.Router();

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    customerName: "Sunita Devi",
    location: "Mumbai, Maharashtra",
    rating: 5,
    comment:
      "Anand Agro Industry has brought back the authentic taste of our childhood. Their jaggery is pure, natural, and reminds me of my grandmother's cooking. Highly recommended!",
    date: "2024-01-20",
    avatar: "/images/testimonials/sunita.jpg",
    verified: true,
  },
  {
    id: 2,
    customerName: "Ramesh Patel",
    location: "Pune, Maharashtra",
    rating: 5,
    comment:
      "As a health-conscious family, we've completely switched to Anand Agro's organic jaggery. The quality is outstanding and the health benefits are visible. Great work!",
    date: "2024-01-18",
    avatar: "/images/testimonials/ramesh.jpg",
    verified: true,
  },
  {
    id: 3,
    customerName: "Dr. Kavya Sharma",
    location: "Nashik, Maharashtra",
    rating: 5,
    comment:
      "Being a nutritionist, I recommend Anand Agro's products to my clients. Their chemical-free processing and traditional methods preserve all the natural minerals and nutrients.",
    date: "2024-01-15",
    avatar: "/images/testimonials/kavya.jpg",
    verified: true,
  },
  {
    id: 4,
    customerName: "Ajay Singh",
    location: "Delhi",
    rating: 4,
    comment:
      "Excellent quality and fast delivery! The flavored jaggery cubes are a hit with my children. Finally, a healthy alternative to processed sweets.",
    date: "2024-01-12",
    avatar: "/images/testimonials/ajay.jpg",
    verified: true,
  },
];

// Get all testimonials
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: testimonials,
      total: testimonials.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch testimonials",
    });
  }
});

// Get featured testimonials (for homepage)
router.get("/featured", (req, res) => {
  try {
    // Return top 3 testimonials with highest ratings
    const featuredTestimonials = testimonials
      .filter((testimonial) => testimonial.verified)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    res.json({
      success: true,
      data: featuredTestimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured testimonials",
    });
  }
});

// Get testimonial by ID
router.get("/:id", (req, res) => {
  try {
    const testimonialId = parseInt(req.params.id);
    const testimonial = testimonials.find((t) => t.id === testimonialId);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch testimonial",
    });
  }
});

module.exports = router;
