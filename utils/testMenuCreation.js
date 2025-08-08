const mongoose = require('mongoose');
require('dotenv').config();

// Import the database configuration
const connectDB = require('../config/database');
const DailyMenu = require('../models/DailyMenu');

async function testMenuCreation() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Test data with a different meal type
    const testMenuData = {
      date: new Date('2025-08-08'), // Today
      mealType: 'lunch',  // Different from existing 'all_day'
      menuItems: [
        {
          name: 'Test Meal',
          category: 'main_course',
          description: 'Test meal description',
          ingredients: ['rice', 'dal'],
          isVegan: false,
          isVegetarian: true,
          spiceLevel: 'medium',
          preparationTime: 30,
        }
      ],
      pricing: {
        fullMeal: 50,
        halfMeal: 30,
        individualItems: [
          {
            itemName: 'Test Meal',
            price: 50,
          }
        ]
      },
      availableQuantity: 100,
      status: 'published',
      chef: 'Test Chef',
      preparationNotes: 'Test meal for debugging',
      allergens: [],
      tags: ['test'],
      createdBy: '6894ea1209c3e9c5e21ab2fa', // Use the admin user ID
      isActive: true,
      autoDeleteAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };

    console.log('Attempting to create test menu...');
    const menu = await DailyMenu.create(testMenuData);
    console.log('✅ Test menu created successfully:', menu._id);

    // Now test with the same date but different meal type
    const testMenuData2 = {
      ...testMenuData,
      mealType: 'dinner',
      menuItems: [
        {
          name: 'Dinner Meal',
          category: 'main_course',
          description: 'Dinner meal description',
          ingredients: ['roti', 'sabzi'],
          isVegan: false,
          isVegetarian: true,
          spiceLevel: 'medium',
          preparationTime: 45,
        }
      ],
      preparationNotes: 'Dinner meal for debugging',
    };

    console.log('Attempting to create second test menu with same date...');
    const menu2 = await DailyMenu.create(testMenuData2);
    console.log('✅ Second test menu created successfully:', menu2._id);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating test menu:', error);
    process.exit(1);
  }
}

// Run the test
testMenuCreation();
