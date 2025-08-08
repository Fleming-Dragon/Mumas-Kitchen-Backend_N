const mongoose = require('mongoose');
require('dotenv').config();

// Import the database configuration
const connectDB = require('../config/database');

async function checkExistingRecords() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Get the DailyMenu collection
    const db = mongoose.connection.db;
    const collection = db.collection('dailymenus');

    // Check for records with the problematic date
    const problematicDate = new Date('2025-08-07T18:30:00.000Z');
    console.log('Checking for records with date:', problematicDate);
    
    const existingRecords = await collection.find({ 
      date: problematicDate 
    }).toArray();
    
    console.log('Found existing records:', existingRecords.length);
    console.log('Existing records:', JSON.stringify(existingRecords, null, 2));

    // Check for any records with today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('Checking for today\'s records between:', today, 'and', tomorrow);
    const todayRecords = await collection.find({
      date: { $gte: today, $lt: tomorrow }
    }).toArray();
    
    console.log('Today\'s records found:', todayRecords.length);
    console.log('Today\'s records:', JSON.stringify(todayRecords, null, 2));

    // Check total count
    const totalCount = await collection.countDocuments();
    console.log('Total documents in collection:', totalCount);

    process.exit(0);

  } catch (error) {
    console.error('Error checking records:', error);
    process.exit(1);
  }
}

// Run the check
checkExistingRecords();
