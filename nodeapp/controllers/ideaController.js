// controllers/ideaController.js
let ideas = [];
let idCounter = 1;

exports._resetData = () => {
  ideas = [];
  idCounter = 1;
};

exports.getIdeas = (req, res) => {
  res.json(ideas);
};

exports.addIdea = (req, res) => {
  const { ideaTitle, description, targetMarket, estimatedBudget } = req.body;
  if (!ideaTitle || !description || !targetMarket || estimatedBudget == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newIdea = { id: idCounter++, ideaTitle, description, targetMarket, estimatedBudget };
  ideas.push(newIdea);
  res.json(newIdea);
};

exports.deleteIdea = (req, res) => {
  const id = parseInt(req.params.id);
  const index = ideas.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: "Idea not found" });
  ideas.splice(index, 1);
  res.json({ message: "Idea deleted" });
};

exports.getValidatedIdeas = (req, res) => {
  const validated = ideas.map(i => ({
    ...i,
    averageScore: i.estimatedBudget < 10000 ? 3 : 5,
    feedback: i.estimatedBudget < 10000 ? "Needs improvement" : "Strong idea"
  }));
  res.json(validated);
};
