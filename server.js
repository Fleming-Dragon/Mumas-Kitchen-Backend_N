require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config/config");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const { initScheduledTasks } = require("./utils/scheduledTasks");

// Connect to database
connectDB();

const app = express();
const PORT = config.PORT;

// Middleware
app.use(helmet());

// CORS Configuration with multiple allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (config.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Rate limiting
app.use(apiLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/daily-menu", require("./routes/dailyMenu"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/public", require("./routes/public"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mama's Kitchen API is running!",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// Catch all handler for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Mama's Kitchen API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`📄 API Documentation: http://localhost:${PORT}/api/health`);

  // Initialize scheduled tasks for automatic cleanup
  initScheduledTasks();
});
