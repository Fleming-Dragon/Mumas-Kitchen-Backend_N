const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductsByCategory,
  getFeaturedProducts
} = require('../controllers/productController');
const { apiLimiter } = require('../middleware/rateLimiter');
  {
    id: 2,
    category: "Jaggery Blocks",
    name: "Premium Jaggery Block",
    description:
      "Premium quality jaggery blocks with enhanced sweetness and purity. Perfect for daily cooking and health benefits.",
    price: 150,
    weight: "1kg",
    image: "/images/premium-jaggery-block.jpg",
    features: [
      "Premium Quality",
      "Enhanced Sweetness",
      "Health Benefits",
      "Daily Use",
    ],
    rating: 4.9,
    reviews: 32,
    inStock: true,
  },
  {
    id: 3,
    category: "Jaggery Powder",
    name: "Fine Jaggery Powder",
    description:
      "Finely ground jaggery powder ideal for quick dissolution in beverages and cooking. Maintains all nutritional benefits.",
    price: 130,
    weight: "500g",
    image: "/images/jaggery-powder.jpg",
    features: ["Quick Dissolving", "Fine Texture", "Nutritional", "Versatile"],
    rating: 4.7,
    reviews: 28,
    inStock: true,
  },
  {
    id: 4,
    category: "Jaggery Powder",
    name: "Instant Jaggery Powder",
    description:
      "Ultra-fine jaggery powder for instant mixing. Perfect for tea, coffee, and quick recipes.",
    price: 140,
    weight: "500g",
    image: "/images/instant-jaggery-powder.jpg",
    features: ["Ultra-fine", "Instant Mix", "Tea & Coffee", "Quick Recipes"],
    rating: 4.6,
    reviews: 19,
    inStock: true,
  },
  {
    id: 5,
    category: "Flavored Jaggery Cubes",
    name: "Coconut Jaggery Cubes",
    description:
      "Delicious jaggery cubes infused with natural coconut flavor. A healthy snack option for the entire family.",
    price: 180,
    weight: "250g",
    image: "/images/coconut-jaggery-cubes.jpg",
    features: [
      "Coconut Flavor",
      "Natural Taste",
      "Healthy Snack",
      "Family Pack",
    ],
    rating: 4.8,
    reviews: 24,
    inStock: true,
  },
  {
    id: 6,
    category: "Flavored Jaggery Cubes",
    name: "Elaichi Jaggery Cubes",
    description:
      "Premium jaggery cubes with aromatic cardamom (elaichi) flavor. Traditional taste with modern convenience.",
    price: 190,
    weight: "250g",
    image: "/images/elaichi-jaggery-cubes.jpg",
    features: [
      "Cardamom Flavor",
      "Aromatic",
      "Traditional Taste",
      "Premium Quality",
    ],
    rating: 4.9,
    reviews: 31,
    inStock: true,
  },
  {
    id: 7,
    category: "Flavored Jaggery Cubes",
    name: "Badishep Jaggery Cubes",
    description:
      "Unique jaggery cubes with badishep (fennel) flavor. Known for digestive properties and refreshing taste.",
    price: 185,
    weight: "250g",
    image: "/images/badishep-jaggery-cubes.jpg",
    features: [
      "Fennel Flavor",
      "Digestive Properties",
      "Refreshing",
      "Unique Taste",
    ],
    rating: 4.7,
    reviews: 18,
    inStock: true,
  },
];

// Get all products
router.get("/", (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      const filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      return res.json({
        success: true,
        data: filteredProducts,
        total: filteredProducts.length,
      });
    }

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

// Get product by ID
router.get("/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
});

// Get product categories
router.get("/categories/all", (req, res) => {
  try {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
});

module.exports = router;
