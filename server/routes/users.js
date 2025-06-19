const express = require("express");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users/:id/recipes
// @desc    Get user's recipes
// @access  Public
router.get("/:id/recipes", async (req, res) => {
  try {
    console.log(`Fetching recipes for user: ${req.params.id}`);

    const recipes = await Recipe.find({
      author: req.params.id,
      // Remove isPublished filter since it might not exist in our model
    })
      .populate("author", "username bio")
      .sort({ createdAt: -1 });

    console.log(`Found ${recipes.length} recipes for user ${req.params.id}`);
    res.json(recipes);
  } catch (error) {
    console.error("Get user recipes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/profile/saved
// @desc    Get user's saved recipes
// @access  Private
router.get("/profile/saved", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      populate: {
        path: "author",
        select: "username avatar",
      },
    });

    res.json(user.savedRecipes);
  } catch (error) {
    console.error("Get saved recipes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/profile/save/:recipeId
// @desc    Save/Unsave recipe
// @access  Private
router.post("/profile/save/:recipeId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.recipeId;

    const isSaved = user.savedRecipes.includes(recipeId);

    if (isSaved) {
      user.savedRecipes = user.savedRecipes.filter(
        (id) => id.toString() !== recipeId
      );
    } else {
      user.savedRecipes.push(recipeId);
    }

    await user.save();

    res.json({
      message: isSaved ? "Recipe removed from saved" : "Recipe saved",
      isSaved: !isSaved,
    });
  } catch (error) {
    console.error("Save recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
