const mongoose = require('mongoose');
require('dotenv').config();

// Import the database configuration
const connectDB = require('../config/database');

async function fixDailyMenuIndexes() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Get the DailyMenu collection
    const db = mongoose.connection.db;
    const collection = db.collection('dailymenus');

    // Get current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Look for any unique indexes
    const uniqueIndexes = indexes.filter(index => index.unique);
    console.log('Unique indexes found:', uniqueIndexes);

    // Drop any unique indexes that involve date field
    for (const index of uniqueIndexes) {
      if (index.key.date) {
        console.log(`Dropping unique index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          console.log(`Successfully dropped ${index.name}`);
        } catch (error) {
          console.log(`Error dropping ${index.name}:`, error.message);
        }
      }
    }

    // Also check for any index with just 'date' field
    const dateOnlyIndexes = indexes.filter(index => 
      Object.keys(index.key).length === 1 && index.key.date
    );
    
    for (const index of dateOnlyIndexes) {
      console.log(`Found date-only index: ${index.name}, unique: ${index.unique}`);
      if (index.unique) {
        console.log(`Dropping unique date-only index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          console.log(`Successfully dropped ${index.name}`);
        } catch (error) {
          console.log(`Error dropping ${index.name}:`, error.message);
        }
      }
    }

    // Verify the final indexes
    const finalIndexes = await collection.indexes();
    console.log('Final indexes:', JSON.stringify(finalIndexes, null, 2));

    console.log('Index fix completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
}

// Run the fix
fixDailyMenuIndexes();
