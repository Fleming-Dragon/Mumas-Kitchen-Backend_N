const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Schema for individual menu items
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required"],
    trim: true,
    maxlength: [100, "Menu item name cannot exceed 100 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: [
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
      ],
      message: "Please select a valid category",
    },
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"],
    trim: true,
  },
  ingredients: [
    {
      type: String,
      trim: true,
    },
  ],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: [0, "Calories cannot be negative"],
    },
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isVegetarian: {
    type: Boolean,
    default: true,
  },
  spiceLevel: {
    type: String,
    enum: ["mild", "medium", "hot", "very_hot"],
    default: "medium",
  },
  preparationTime: {
    type: Number, // in minutes
    min: [0, "Preparation time cannot be negative"],
  },
  image: {
    type: String, // URL to image
    trim: true,
  },
});

// Main Daily Menu Schema
const dailyMenuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    mealType: {
      type: String,
      required: [true, "Meal type is required"],
      default: "lunch",
    },
    menuItems: [menuItemSchema],
    specialOffers: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: [200, "Offer title cannot exceed 200 characters"],
        },
        description: {
          type: String,
          maxlength: [500, "Offer description cannot exceed 500 characters"],
          trim: true,
        },
        discount: {
          type: Number,
          min: [0, "Discount cannot be negative"],
          max: [100, "Discount cannot exceed 100%"],
        },
        validUntil: {
          type: Date,
        },
      },
    ],
    pricing: {
      fullMeal: {
        type: Number,
        required: [true, "Full meal price is required"],
        min: [0, "Price cannot be negative"],
      },
      halfMeal: {
        type: Number,
        min: [0, "Price cannot be negative"],
      },
      individualItems: [
        {
          itemName: String,
          price: {
            type: Number,
            min: [0, "Price cannot be negative"],
          },
        },
      ],
    },
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 50,
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: [0, "Sold quantity cannot be negative"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "sold_out", "archived"],
      default: "draft",
    },
    chef: {
      type: String,
      trim: true,
      maxlength: [100, "Chef name cannot exceed 100 characters"],
    },
    preparationNotes: {
      type: String,
      maxlength: [1000, "Preparation notes cannot exceed 1000 characters"],
      trim: true,
    },
    allergens: [
      {
        type: String,
        enum: [
          "nuts",
          "dairy",
          "gluten",
          "soy",
          "eggs",
          "shellfish",
          "fish",
          "sesame",
        ],
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    autoDeleteAt: {
      type: Date,
      index: { expireAfterSeconds: 0 }, // TTL index for automatic deletion
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for remaining quantity
dailyMenuSchema.virtual("remainingQuantity").get(function () {
  return this.availableQuantity - this.soldQuantity;
});

// Virtual for is sold out
dailyMenuSchema.virtual("isSoldOut").get(function () {
  return this.soldQuantity >= this.availableQuantity;
});

// Index for efficient querying
dailyMenuSchema.index({ status: 1, isActive: 1 });
dailyMenuSchema.index({ createdBy: 1 });

// Pre-save middleware
dailyMenuSchema.pre("save", function (next) {
  // Update status to sold_out if quantity is reached
  if (
    this.soldQuantity >= this.availableQuantity &&
    this.status !== "sold_out"
  ) {
    this.status = "sold_out";
  }

  // Ensure date is set to start of day
  if (this.date) {
    this.date = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate()
    );
  }

  next();
});

// Static methods
dailyMenuSchema.statics.findByDate = function (date) {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return this.find({
    date: { $gte: startOfDay, $lt: endOfDay },
    isActive: true,
  }).populate("createdBy", "firstName lastName email");
};

dailyMenuSchema.statics.findAvailableMenus = function (startDate, endDate) {
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    status: { $in: ["published"] },
    isActive: true,
    $expr: { $gt: ["$availableQuantity", "$soldQuantity"] },
  }).populate("createdBy", "firstName lastName email");
};

// Add pagination plugin
dailyMenuSchema.plugin(mongoosePaginate);

// Create index for efficient querying (not unique to allow multiple meals per day)
dailyMenuSchema.index({ date: 1, mealType: 1 });

module.exports = mongoose.model("DailyMenu", dailyMenuSchema);
