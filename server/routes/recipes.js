const express = require("express");
const { body, validationResult } = require("express-validator");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all recipes with filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      search,
      cuisine,
      tags,
      difficulty,
      maxTime,
      sort = "latest",
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "ingredients.name": { $regex: search, $options: "i" } },
      ];
    }

    if (cuisine) {
      query.cuisine = cuisine;
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (maxTime) {
      query.$expr = {
        $lte: [{ $add: ["$prepTime", "$cookTime"] }, parseInt(maxTime)],
      };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "popular":
        sortOption = { likes: -1, createdAt: -1 };
        break;
      case "trending":
        sortOption = { views: -1, createdAt: -1 };
        break;
      case "latest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const recipes = await Recipe.find(query)
      .populate("author", "username bio")
      .populate("likes", "username")
      .sort(sortOption)
      .limit(limit * page)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "username avatar bio")
      .lean();

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Increment view count
    await Recipe.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Add user interaction data
    if (req.user) {
      recipe.isLiked = recipe.likes.includes(req.user._id);
      recipe.isSaved = req.user.savedRecipes.includes(recipe._id);
    }

    res.json(recipe);
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cuisine,
      tags,
      image,
    } = req.body;

    // Process image if provided
    let imageData = null;
    if (image) {
      if (typeof image === 'string' && image.startsWith('data:image/')) {
        imageData = {
          url: image,
          public_id: `recipe_${Date.now()}`
        };
      } else if (typeof image === 'string') {
        imageData = {
          url: image,
          public_id: `recipe_${Date.now()}`
        };
      }
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      difficulty,
      cuisine,
      tags: tags || [],
      image: imageData,
      author: req.user._id,
    });

    await recipe.save();
    await recipe.populate("author", "username bio");

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cuisine,
      tags,
      image,
    } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user owns this recipe
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Process image if provided
    let imageData = recipe.image;
    if (image !== null) {
      if (image && typeof image === 'string' && image.startsWith('data:image/')) {
        imageData = {
          url: image,
          public_id: `recipe_${Date.now()}`
        };
      } else if (image && typeof image === 'string') {
        imageData = {
          url: image,
          public_id: `recipe_${Date.now()}`
        };
      } else if (!image) {
        imageData = null;
      }
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        ingredients,
        instructions,
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        servings: parseInt(servings),
        difficulty,
        cuisine,
        tags: tags || [],
        image: imageData,
      },
      { new: true }
    ).populate("author", "username bio");

    res.json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/recipes/:id/like
// @desc    Like/Unlike recipe
// @access  Private
router.post("/:id/like", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const isLiked = recipe.likes.includes(req.user._id);

    if (isLiked) {
      recipe.likes = recipe.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      recipe.likes.push(req.user._id);
    }

    await recipe.save();

    res.json({
      message: isLiked ? "Recipe unliked" : "Recipe liked",
      likes: recipe.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error("Like recipe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/recipes/suggest
// @desc    Suggest recipes based on ingredients
// @access  Public
router.post("/suggest", async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Please provide at least one ingredient" });
    }

    // Create regex patterns for fuzzy matching
    const ingredientPatterns = ingredients.map(
      (ingredient) => new RegExp(ingredient.trim(), "i")
    );

    // Find recipes that contain any of the provided ingredients
    const recipes = await Recipe.find({
      isPublished: true,
      $or: [
        { "ingredients.name": { $in: ingredientPatterns } },
        { title: { $in: ingredientPatterns } },
        { description: { $in: ingredientPatterns } },
      ],
    })
      .populate("author", "username avatar")
      .limit(10)
      .lean();

    // Score recipes based on ingredient matches
    const scoredRecipes = recipes.map((recipe) => {
      let score = 0;
      ingredients.forEach((ingredient) => {
        const regex = new RegExp(ingredient.trim(), "i");
        if (recipe.ingredients.some((ing) => regex.test(ing.name))) {
          score += 2; // Exact ingredient match
        }
        if (regex.test(recipe.title) || regex.test(recipe.description)) {
          score += 1; // Title/description match
        }
      });
      return { ...recipe, matchScore: score };
    });

    // Sort by score and return top matches
    scoredRecipes.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      suggestions: scoredRecipes.slice(0, 6),
      ingredients: ingredients,
    });
  } catch (error) {
    console.error("Suggest recipes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
