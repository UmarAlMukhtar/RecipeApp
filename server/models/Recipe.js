const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        amount: {
          type: String,
          required: true,
          trim: true,
        },
        unit: {
          type: String,
          trim: true,
        },
      },
    ],
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    prepTime: {
      type: Number,
      required: [true, "Prep time is required"],
      min: [1, "Prep time must be at least 1 minute"],
    },
    cookTime: {
      type: Number,
      required: [true, "Cook time is required"],
      min: [1, "Cook time must be at least 1 minute"],
    },
    servings: {
      type: Number,
      required: [true, "Servings is required"],
      min: [1, "Servings must be at least 1"],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    cuisine: {
      type: String,
      required: [true, "Cuisine type is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    image: {
      url: String,
      publicId: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
recipeSchema.index({ title: "text", description: "text", tags: "text" });
recipeSchema.index({ author: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ createdAt: -1 });

// Virtual for total time
recipeSchema.virtual("totalTime").get(function () {
  return this.prepTime + this.cookTime;
});

// Virtual for like count
recipeSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

module.exports = mongoose.model("Recipe", recipeSchema);
