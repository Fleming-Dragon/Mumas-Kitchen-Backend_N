const cron = require("node-cron");
const DailyMenu = require("../models/DailyMenu");

// Function to clean up expired daily meals
const cleanupExpiredMeals = async () => {
  try {
    const now = new Date();
    console.log(
      `[${now.toISOString()}] Running cleanup for expired daily meals...`
    );

    // Find and delete expired meals
    const result = await DailyMenu.deleteMany({
      autoDeleteAt: { $lte: now },
    });

    if (result.deletedCount > 0) {
      console.log(
        `[${now.toISOString()}] Cleaned up ${
          result.deletedCount
        } expired daily meals`
      );
    }

    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up expired meals:", error);
    return 0;
  }
};

// Function to initialize scheduled tasks
const initScheduledTasks = () => {
  console.log("Initializing scheduled tasks...");

  // Run cleanup every hour
  cron.schedule("0 * * * *", async () => {
    await cleanupExpiredMeals();
  });

  // Run cleanup at midnight every day
  cron.schedule("0 0 * * *", async () => {
    console.log("Running midnight cleanup...");
    await cleanupExpiredMeals();
  });

  console.log("Scheduled tasks initialized successfully");
};

module.exports = {
  cleanupExpiredMeals,
  initScheduledTasks,
};
