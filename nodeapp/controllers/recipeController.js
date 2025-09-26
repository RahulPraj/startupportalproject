const Recipe = require('../models/recipeModel');

const getAllRecipes = async (req, res) => {
  try {
    const sortOrder = parseInt(req.body.sortOrder) || 1; // 1 for ASC, -1 for DESC
    const recipes = await Recipe.find().sort({ prepTimeInMinutes: sortOrder });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipesByUserId = async (req, res) => {
  try {
    const { userId, category } = req.body;
    const filter = { userId };

    if (category) {
      filter.category = category;
    }

    const recipes = await Recipe.find(filter);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const addRecipe = async (req, res) => {
  try {
    await Recipe.create(req.body);
    res.status(200).json({ message: 'Recipe Added Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.status(200).json({ message: 'Recipe Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.status(200).json({ message: 'Recipe Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipesByUserId,
  addRecipe,
  updateRecipe,
  deleteRecipe
};