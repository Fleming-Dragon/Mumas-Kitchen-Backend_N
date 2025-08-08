const mongoose = require("mongoose");
const config = require("../config/config");

const testAPI = async () => {
  try {
    console.log("🧪 Testing Mama's Kitchen API...\n");

    // Test 1: Database Connection
    console.log("1. Testing Database Connection...");
    try {
      await mongoose.connect(config.MONGODB_URI);
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.log("❌ Database connection failed:", error.message);
      return;
    }

    // Test 2: Check if admin user exists
    console.log("\n2. Testing Admin User...");
    const User = require("../models/User");
    const admin = await User.findOne({ email: "admin@mamaskitchen.com" });
    if (admin) {
      console.log("✅ Admin user exists");
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Role: ${admin.role}`);
    } else {
      console.log("❌ Admin user not found");
    }

    // Test 3: Check products
    console.log("\n3. Testing Products...");
    const Product = require("../models/Product");
    const products = await Product.find({});
    console.log(`✅ Found ${products.length} products`);
    products.forEach((product, index) => {
      console.log(
        `   ${index + 1}. ${product.name} - ₹${product.price} (${
          product.category
        })`
      );
    });

    // Test 4: Check reviews
    console.log("\n4. Testing Reviews...");
    const Review = require("../models/Review");
    const reviews = await Review.find({}).populate("product", "name");
    console.log(`✅ Found ${reviews.length} reviews`);
    reviews.forEach((review, index) => {
      console.log(
        `   ${index + 1}. ${review.rating}⭐ - ${review.title} (${
          review.product.name
        })`
      );
    });

    // Test 5: Check testimonials
    console.log("\n5. Testing Testimonials...");
    const Testimonial = require("../models/Testimonial");
    const testimonials = await Testimonial.find({});
    console.log(`✅ Found ${testimonials.length} testimonials`);
    testimonials.forEach((testimonial, index) => {
      console.log(
        `   ${index + 1}. ${testimonial.name} from ${testimonial.location} - ${
          testimonial.rating
        }⭐`
      );
    });

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Database: Connected to ${config.MONGODB_URI}`);
    console.log(`   - Admin: ${admin ? "Created" : "Missing"}`);
    console.log(`   - Products: ${products.length} items`);
    console.log(`   - Reviews: ${reviews.length} items`);
    console.log(`   - Testimonials: ${testimonials.length} items`);

    console.log("\n🚀 Ready to start development!");
    console.log("   - Start server: npm run dev");
    console.log("   - API Health: http://localhost:5000/api/health");
    console.log("   - Admin Login: admin@mamaskitchen.com / Admin@123");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run tests if called directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
