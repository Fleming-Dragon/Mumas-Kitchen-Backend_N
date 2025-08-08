const DailyMenu = require("../models/DailyMenu");

// @desc    Get today's active meals for public display
// @route   GET /api/public/today-meals
// @access  Public
const getTodaysMeals = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Find today's published menus that are available
    const menus = await DailyMenu.find({
      date: { $gte: startOfDay, $lt: endOfDay },
      status: "published",
      isActive: true,
      $expr: { $gt: ["$availableQuantity", "$soldQuantity"] },
    }).select("menuItems pricing date mealType preparationNotes tags");

    // Transform the data for public display
    const publicMeals = [];

    menus.forEach((menu) => {
      menu.menuItems.forEach((item) => {
        // Find price for this item
        const itemPrice = menu.pricing?.individualItems?.find(
          (price) => price.itemName === item.name
        );

        publicMeals.push({
          id: `${menu._id}_${item.name}`.replace(/\s+/g, "_"),
          title: item.name,
          description:
            item.description || `Delicious ${item.name} prepared fresh today`,
          price: itemPrice?.price || menu.pricing?.fullMeal || 0,
          category: item.category,
          ingredients: item.ingredients || [],
          isVegan: item.isVegan || false,
          isVegetarian: item.isVegetarian !== false, // Default to true
          spiceLevel: item.spiceLevel || "medium",
          preparationTime: item.preparationTime || 30,
          nutritionalInfo: item.nutritionalInfo,
          allergens: item.allergens || [],
          tags: menu.tags || [],
          availableUntil: menu.autoDeleteAt || endOfDay,
          mealType: menu.mealType,
        });
      });
    });

    res.json({
      success: true,
      data: {
        meals: publicMeals,
        date: today.toISOString().split("T")[0],
        totalMeals: publicMeals.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching today's meals:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching today's meals",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get meal categories for filtering
// @route   GET /api/public/meal-categories
// @access  Public
const getMealCategories = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Get unique categories from today's meals
    const categories = await DailyMenu.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lt: endOfDay },
          status: "published",
          isActive: true,
        },
      },
      { $unwind: "$menuItems" },
      {
        $group: {
          _id: "$menuItems.category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories.map((cat) => ({
        category: cat._id,
        count: cat.count,
      })),
    });
  } catch (error) {
    console.error("Error fetching meal categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching meal categories",
    });
  }
};

module.exports = {
  getTodaysMeals,
  getMealCategories,
};
