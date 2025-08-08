const DailyMenu = require("../models/DailyMenu");
const { validationResult } = require("express-validator");

// Get all daily menus with filters
exports.getAllMenus = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      date,
      mealType,
      status,
      startDate,
      endDate,
      chef,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      );
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      filter.date = { $gte: startOfDay, $lt: endOfDay };
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (mealType) filter.mealType = mealType;
    if (status) filter.status = status;
    if (chef) filter.chef = new RegExp(chef, "i");

    console.log("📅 Getting daily menus with filter:", filter);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: "createdBy", select: "firstName lastName email" },
        { path: "lastModifiedBy", select: "firstName lastName email" },
      ],
      sort: { date: -1, createdAt: -1 },
    };

    const menus = await DailyMenu.paginate(filter, options);

    res.json({
      success: true,
      data: menus.docs,
      pagination: {
        page: menus.page,
        limit: menus.limit,
        total: menus.totalDocs,
        pages: menus.totalPages,
        hasNext: menus.hasNextPage,
        hasPrev: menus.hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Get menus error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily menus",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get daily menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await DailyMenu.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("lastModifiedBy", "firstName lastName email");

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Daily menu not found",
      });
    }

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error("Get menu by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily menu",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get menu by date
exports.getMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { mealType } = req.query;

    const targetDate = new Date(date);
    let filter = { date: targetDate, isActive: true };

    if (mealType) {
      filter.mealType = mealType;
    }

    const menus = await DailyMenu.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ mealType: 1 });

    res.json({
      success: true,
      data: menus,
      count: menus.length,
    });
  } catch (error) {
    console.error("Get menu by date error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu for the specified date",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Create new daily menu
exports.createMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const menuData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // Make mealType unique by adding timestamp to prevent conflicts when creating multiple meals per day
    if (menuData.mealType === 'all_day') {
      const timestamp = Date.now();
      menuData.mealType = `all_day_${timestamp}`;
    }

    // Always create a new menu (allows multiple meals per day)
    const menu = await DailyMenu.create(menuData);

    // Populate the created menu
    await menu.populate("createdBy", "firstName lastName email");

    console.log("📅 Daily menu created:", menu._id);

    res.status(201).json({
      success: true,
      message: "Daily menu created successfully",
      data: menu,
    });
  } catch (error) {
    console.error("Create menu error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create daily menu",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Update daily menu
exports.updateMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user.id,
    };

    const menu = await DailyMenu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Daily menu not found",
      });
    }

    // Check if user has permission (admin or creator)
    if (
      req.user.role !== "admin" &&
      menu.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this menu",
      });
    }

    const updatedMenu = await DailyMenu.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "firstName lastName email")
      .populate("lastModifiedBy", "firstName lastName email");

    console.log("📅 Daily menu updated:", updatedMenu._id);

    res.json({
      success: true,
      message: "Daily menu updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update daily menu",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Delete daily menu (soft delete)
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await DailyMenu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Daily menu not found",
      });
    }

    // Check if user has permission (admin or creator)
    if (
      req.user.role !== "admin" &&
      menu.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this menu",
      });
    }

    // Soft delete
    menu.isActive = false;
    menu.lastModifiedBy = req.user.id;
    await menu.save();

    console.log("📅 Daily menu deleted (soft):", menu._id);

    res.json({
      success: true,
      message: "Daily menu deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete daily menu",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Update menu status
exports.updateMenuStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "published", "sold_out", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const menu = await DailyMenu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Daily menu not found",
      });
    }

    // Check if user has permission (admin or creator)
    if (
      req.user.role !== "admin" &&
      menu.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this menu status",
      });
    }

    menu.status = status;
    menu.lastModifiedBy = req.user.id;
    await menu.save();

    console.log("📅 Daily menu status updated:", menu._id, "→", status);

    res.json({
      success: true,
      message: "Menu status updated successfully",
      data: { status: menu.status },
    });
  } catch (error) {
    console.error("Update menu status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu status",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get available menus (for customers)
exports.getAvailableMenus = async (req, res) => {
  try {
    const { date, mealType } = req.query;

    let filter = {
      status: "published",
      isActive: true,
      $expr: { $gt: ["$availableQuantity", "$soldQuantity"] },
    };

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      );
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      filter.date = { $gte: startOfDay, $lt: endOfDay };
    } else {
      // Default to today and future dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }

    if (mealType) filter.mealType = mealType;

    const menus = await DailyMenu.find(filter)
      .populate("createdBy", "firstName lastName")
      .sort({ date: 1, mealType: 1 })
      .limit(20);

    res.json({
      success: true,
      data: menus,
      count: menus.length,
    });
  } catch (error) {
    console.error("Get available menus error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available menus",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
