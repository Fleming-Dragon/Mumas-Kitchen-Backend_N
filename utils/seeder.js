const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Testimonial = require("../models/Testimonial");
const connectDB = require("../config/database");
require("dotenv").config();

// Sample data for seeding
const sampleProducts = [
  {
    name: "Classic Chicken Curry",
    category: "main-course",
    description:
      "Traditional homestyle chicken curry cooked with aromatic spices and rich gravy. Perfect comfort food that reminds you of home.",
    price: 299,
    weight: { value: 500, unit: "g" },
    images: [
      {
        url: "/uploads/chicken-curry.jpg",
        alt: "Classic Chicken Curry",
        isPrimary: true,
      },
    ],
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 28,
    },
    ingredients: ["Chicken", "Onions", "Tomatoes", "Ginger-Garlic", "Spices"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: "medium",
    cookingTime: 45,
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Paneer Butter Masala",
    category: "main-course",
    description:
      "Creamy and rich paneer curry in buttery tomato-based sauce. A vegetarian favorite loved by all.",
    price: 249,
    weight: { value: 400, unit: "g" },
    images: [
      {
        url: "/uploads/paneer-butter-masala.jpg",
        alt: "Paneer Butter Masala",
        isPrimary: true,
      },
    ],
    nutritionalInfo: {
      calories: 380,
      protein: 18,
      carbs: 12,
      fat: 32,
    },
    ingredients: ["Paneer", "Tomatoes", "Cream", "Butter", "Spices"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: "mild",
    cookingTime: 30,
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Samosa Platter",
    category: "appetizers",
    description:
      "Crispy golden samosas filled with spiced potatoes and peas. Served with mint and tamarind chutneys.",
    price: 120,
    weight: { value: 200, unit: "g" },
    images: [
      {
        url: "/uploads/samosa-platter.jpg",
        alt: "Samosa Platter",
        isPrimary: true,
      },
    ],
    nutritionalInfo: {
      calories: 280,
      protein: 6,
      carbs: 35,
      fat: 14,
    },
    ingredients: ["Potatoes", "Peas", "Flour", "Oil", "Spices"],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    spiceLevel: "mild",
    cookingTime: 20,
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Gulab Jamun",
    category: "desserts",
    description:
      "Soft and spongy milk dumplings soaked in sweet cardamom-flavored syrup. A classic Indian dessert.",
    price: 89,
    weight: { value: 150, unit: "g" },
    images: [
      {
        url: "/uploads/gulab-jamun.jpg",
        alt: "Gulab Jamun",
        isPrimary: true,
      },
    ],
    nutritionalInfo: {
      calories: 320,
      protein: 8,
      carbs: 45,
      fat: 12,
    },
    ingredients: ["Milk Solids", "Sugar", "Cardamom", "Rose Water"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: "none",
    cookingTime: 15,
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Masala Chai",
    category: "beverages",
    description:
      "Aromatic spiced tea brewed with cardamom, ginger, and other warm spices. Perfect companion for any meal.",
    price: 45,
    weight: { value: 250, unit: "ml" },
    images: [
      {
        url: "/uploads/masala-chai.jpg",
        alt: "Masala Chai",
        isPrimary: true,
      },
    ],
    nutritionalInfo: {
      calories: 80,
      protein: 3,
      carbs: 12,
      fat: 3,
    },
    ingredients: ["Tea Leaves", "Milk", "Sugar", "Cardamom", "Ginger"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    spiceLevel: "mild",
    cookingTime: 10,
    isAvailable: true,
    isFeatured: false,
  },
];

const sampleAdmin = {
  username: "admin",
  email: "admin@mamaskitchen.com",
  password: "Admin@123",
  firstName: "Mama's",
  lastName: "Kitchen",
  role: "admin",
  phone: "9876543210",
  isActive: true,
};

const sampleTestimonials = [
  {
    name: "Anjali Patel",
    location: "Mumbai",
    message:
      "Mama's Kitchen has brought the authentic taste of home-cooked meals to our doorstep. Every dish is prepared with love and care.",
    rating: 5,
    isApproved: true,
  },
  {
    name: "Vikram Singh",
    location: "Delhi",
    message:
      "The quality and taste of food is exceptional. It reminds me of my mother's cooking. Thank you for keeping traditions alive!",
    rating: 5,
    isApproved: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Testimonial.deleteMany({});

    // Create admin user
    console.log("👤 Creating admin user...");
    await User.create(sampleAdmin);

    // Create sample products
    console.log("🍛 Creating sample products...");
    const createdProducts = await Product.create(sampleProducts);

    // Create sample reviews with product references
    console.log("⭐ Creating sample reviews...");
    const reviewsWithProducts = [
      {
        product: createdProducts[0]._id, // Chicken Curry
        rating: 5,
        title: "Absolutely Delicious!",
        comment:
          "Amazing chicken curry! Just like my grandmother used to make.",
        name: "Priya Sharma",
        email: "priya@email.com",
        isApproved: true,
      },
      {
        product: createdProducts[1]._id, // Paneer Butter Masala
        rating: 5,
        title: "Best Paneer Ever!",
        comment:
          "The paneer butter masala is absolutely delicious. Highly recommended!",
        name: "Rahul Gupta",
        email: "rahul@email.com",
        isApproved: true,
      },
    ];
    await Review.create(reviewsWithProducts);

    // Create sample testimonials
    console.log("💬 Creating sample testimonials...");
    await Testimonial.create(sampleTestimonials);

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Created ${sampleProducts.length} products`);
    console.log(`⭐ Created ${reviewsWithProducts.length} reviews`);
    console.log(`💬 Created ${sampleTestimonials.length} testimonials`);
    console.log("🔑 Admin credentials:");
    console.log("   Email: admin@mamaskitchen.com");
    console.log("   Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts, sampleAdmin };
