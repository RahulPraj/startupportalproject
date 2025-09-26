// In-memory mock storage
let ideas = [];
let idCounter = 1;

exports.addIdea = (req, res) => {
  const { ideaTitle, description, targetMarket, estimatedBudget } = req.body;
  if (!ideaTitle || !description || !targetMarket || estimatedBudget == null) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newIdea = {
    id: idCounter++,
    ideaTitle,
    description,
    targetMarket,
    estimatedBudget
  };
  ideas.push(newIdea);
  res.json(newIdea);
};

exports.getAllIdeas = (req, res) => {
  res.json(ideas);
};

exports.deleteIdea = (req, res) => {
  const id = parseInt(req.params.id);
  const index = ideas.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Idea not found" });
  }
  ideas.splice(index, 1);
  res.json({ message: "Idea deleted" });
};

exports.getValidatedIdeas = (req, res) => {
  // Mock validation scoring
  const validated = ideas.map(i => ({
    ideaTitle: i.ideaTitle,
    averageScore: i.estimatedBudget > 20000 ? 2.5 : 4.5,
    feedback:
      i.estimatedBudget > 20000
        ? "Needs work — clarify market and reduce budget."
        : "Strong potential — feasible budget.",
    estimatedBudget: i.estimatedBudget,
    targetMarket: i.targetMarket
  }));
  res.json(validated);
};

// helper for tests to reset memory
exports._resetData = () => {
  ideas = [];
  idCounter = 1;
};
