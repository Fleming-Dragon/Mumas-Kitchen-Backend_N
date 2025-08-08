const { body } = require("express-validator");

// Validation for menu item
const menuItemValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Menu item name must be 1-100 characters long"),

  body("category")
    .isIn([
      "main_course",
      "bread",
      "vegetable",
      "salad",
      "rice",
      "dal",
      "dessert",
      "beverage",
      "snack",
      "other",
    ])
    .withMessage("Please select a valid category"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("ingredients")
    .optional()
    .isArray()
    .withMessage("Ingredients must be an array"),

  body("ingredients.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Each ingredient must be 1-100 characters long"),

  body("nutritionalInfo.calories")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Calories must be a positive number"),

  body("isVegan")
    .optional()
    .isBoolean()
    .withMessage("isVegan must be a boolean"),

  body("isVegetarian")
    .optional()
    .isBoolean()
    .withMessage("isVegetarian must be a boolean"),

  body("spiceLevel")
    .optional()
    .isIn(["mild", "medium", "hot", "very_hot"])
    .withMessage("Please select a valid spice level"),

  body("preparationTime")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Preparation time must be a positive number"),

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),
];

// Create daily menu validation
exports.validateCreateMenu = [
  body("date")
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        throw new Error("Cannot create menu for past dates");
      }
      return true;
    }),

  body("mealType")
    .isIn(["breakfast", "lunch", "dinner", "all_day"])
    .withMessage("Please select a valid meal type"),

  body("menuItems")
    .isArray({ min: 1 })
    .withMessage("At least one menu item is required"),

  body("menuItems.*.name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Menu item name must be 1-100 characters long"),

  body("menuItems.*.category")
    .isIn([
      "main_course",
      "bread",
      "vegetable",
      "salad",
      "rice",
      "dal",
      "dessert",
      "beverage",
      "snack",
      "other",
    ])
    .withMessage("Please select a valid category for all menu items"),

  body("menuItems.*.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Menu item description cannot exceed 500 characters"),

  body("menuItems.*.spiceLevel")
    .optional()
    .isIn(["mild", "medium", "hot", "very_hot"])
    .withMessage("Please select a valid spice level"),

  body("specialOffers")
    .optional()
    .isArray()
    .withMessage("Special offers must be an array"),

  body("specialOffers.*.title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Offer title must be 1-200 characters long"),

  body("specialOffers.*.discount")
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),

  body("pricing.fullMeal")
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Full meal price must be a positive number"),

  body("pricing.halfMeal")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Half meal price must be a positive number"),

  body("pricing.individualItems")
    .optional()
    .isArray()
    .withMessage("Individual items pricing must be an array"),

  body("pricing.individualItems.*.itemName")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Item name is required"),

  body("pricing.individualItems.*.price")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Item price must be a positive number"),

  body("availableQuantity")
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage("Available quantity must be at least 1"),

  body("chef")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Chef name cannot exceed 100 characters"),

  body("preparationNotes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Preparation notes cannot exceed 1000 characters"),

  body("allergens")
    .optional()
    .isArray()
    .withMessage("Allergens must be an array"),

  body("allergens.*")
    .optional()
    .isIn([
      "nuts",
      "dairy",
      "gluten",
      "soy",
      "eggs",
      "shellfish",
      "fish",
      "sesame",
    ])
    .withMessage("Please select valid allergens"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be 1-50 characters long"),

  body("status")
    .optional()
    .isIn(["draft", "published", "sold_out", "archived"])
    .withMessage("Please select a valid status"),
];

// Update daily menu validation
exports.validateUpdateMenu = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),

  body("mealType")
    .optional()
    .isIn(["breakfast", "lunch", "dinner", "all_day"])
    .withMessage("Please select a valid meal type"),

  body("menuItems")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one menu item is required"),

  body("menuItems.*.name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Menu item name must be 1-100 characters long"),

  body("menuItems.*.category")
    .optional()
    .isIn([
      "main_course",
      "bread",
      "vegetable",
      "salad",
      "rice",
      "dal",
      "dessert",
      "beverage",
      "snack",
      "other",
    ])
    .withMessage("Please select a valid category for all menu items"),

  body("pricing.fullMeal")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Full meal price must be a positive number"),

  body("pricing.halfMeal")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Half meal price must be a positive number"),

  body("availableQuantity")
    .optional()
    .isNumeric()
    .isInt({ min: 0 })
    .withMessage("Available quantity must be a positive number"),

  body("soldQuantity")
    .optional()
    .isNumeric()
    .isInt({ min: 0 })
    .withMessage("Sold quantity must be a positive number"),

  body("status")
    .optional()
    .isIn(["draft", "published", "sold_out", "archived"])
    .withMessage("Please select a valid status"),

  body("chef")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Chef name cannot exceed 100 characters"),

  body("preparationNotes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Preparation notes cannot exceed 1000 characters"),
];

// Validation for menu status update
exports.validateStatusUpdate = [
  body("status")
    .isIn(["draft", "published", "sold_out", "archived"])
    .withMessage("Please select a valid status"),
];
