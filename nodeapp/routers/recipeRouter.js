const express = require("express");
const recipeController = require("../controllers/recipeController");
const { validateToken } = require("../authUtils");
const router = express.Router();

// Get all recipes (sorted by prep time)
router.post("/getAllRecipes", recipeController.getAllRecipes);

// Get recipe by its ID
router.get("/getRecipeById/:id", recipeController.getRecipeById);

// Get recipes by user ID (and optional category filter)
router.post("/getRecipesByUserId", recipeController.getRecipesByUserId);

// Add a new recipe
router.post("/addRecipe", recipeController.addRecipe);

// Update existing recipe
router.put("/updateRecipe/:id", recipeController.updateRecipe);

// Delete recipe
router.delete("/deleteRecipe/:id", recipeController.deleteRecipe);

module.exports = router;