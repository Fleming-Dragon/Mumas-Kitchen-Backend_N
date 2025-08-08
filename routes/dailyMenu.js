const express = require("express");
const dailyMenuController = require("../controllers/dailyMenuController");
const dailyMenuValidator = require("../validators/dailyMenuValidator");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Public routes (for customers to view available menus)
router.get("/available", apiLimiter, dailyMenuController.getAvailableMenus);

router.get("/date/:date", apiLimiter, dailyMenuController.getMenuByDate);

// Protected routes (require authentication)
router.use(authenticate);

// Routes for authenticated users (customers can view all menus)
router.get("/", dailyMenuController.getAllMenus);
router.get("/:id", dailyMenuController.getMenuById);

// Admin only routes
router.use(requireAdmin);

router.post(
  "/",
  dailyMenuValidator.validateCreateMenu,
  dailyMenuController.createMenu
);

router.put(
  "/:id",
  dailyMenuValidator.validateUpdateMenu,
  dailyMenuController.updateMenu
);

router.patch(
  "/:id/status",
  dailyMenuValidator.validateStatusUpdate,
  dailyMenuController.updateMenuStatus
);

router.delete("/:id", dailyMenuController.deleteMenu);

module.exports = router;
