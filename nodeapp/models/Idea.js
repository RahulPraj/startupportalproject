const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  ideaTitle: { type: String, required: true },
  description: { type: String, required: true },
  targetMarket: { type: String, required: true },
  estimatedBudget: { type: Number, required: true }
});

module.exports = mongoose.model("Idea", IdeaSchema);
