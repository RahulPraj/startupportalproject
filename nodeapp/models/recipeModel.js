const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Other'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  prepTimeInMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  cookTimeInMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  cuisine: {
    type: String,
    enum: ['Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Thai', 'French', 'Mediterranean', 'Other'],
    default: 'Other'
  },
  ingredients: {
    type: [String], // e.g., ['2 cups flour', '1 tsp salt', '3 eggs']
    required: true,
    validate: {
      validator: function(value) {
        return value && value.length > 0;
      },
      message: 'At least one ingredient is required!'
    }
  },
  instructions: {
    type: [String], // e.g., ['Mix flour and salt', 'Add eggs and mix well']
    required: true,
    validate: {
      validator: function(value) {
        return value && value.length > 0;
      },
      message: 'At least one instruction is required!'
    }
  },
  tags: {
    type: [String], // e.g., ['vegetarian', 'gluten-free', 'quick', 'healthy']
    default: []
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 }, // in grams
    carbs: { type: Number, min: 0 }, // in grams
    fat: { type: Number, min: 0 } // in grams
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;