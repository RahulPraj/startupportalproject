import React, { useState } from "react";
import { addIdea } from "../services/api";
//import "../styles/IdeaForm.css";

export default function IdeaForm({ onAdd }) {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");

  const resetForm = () => {
    setIdeaTitle("");
    setDescription("");
    setTargetMarket("");
    setEstimatedBudget("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ideaTitle.trim() || !description.trim()) {
      alert("Please provide at least a title and description.");
      return;
    }

    if (estimatedBudget && isNaN(Number(estimatedBudget))) {
      alert("Estimated budget must be a valid number.");
      return;
    }

    const payload = {
      ideaTitle: ideaTitle.trim(),
      description: description.trim(),
      targetMarket: targetMarket.trim(),
      estimatedBudget: Number(estimatedBudget) || 0
    };

    try {
      await addIdea(payload);
      if (typeof onAdd === "function") {
        onAdd();
      }
      resetForm();
    } catch (err) {
      console.error("Error adding idea:", err);
      alert("Failed to add idea. Check backend connection.");
    }
  };

  return (
    <div className="card IdeaForm-card">
      <h3>Submit Startup Idea</h3>
      <form className="IdeaForm-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            placeholder="Idea Title"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea"
            rows={4}
            required
          />
        </label>

        <label>
          Target Market
          <input
            type="text"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
            placeholder="e.g., Small Businesses, Online Retailers"
          />
        </label>

        <label>
          Estimated Budget (USD)
          <input
            type="number"
            min="0"
            step="100"
            value={estimatedBudget}
            onChange={(e) => setEstimatedBudget(e.target.value)}
            placeholder="e.g., 20000"
          />
        </label>

        <div className="IdeaForm-actions">
          <button type="submit" className="btn-primary">Submit Idea</button>
          <button type="button" className="btn-secondary" onClick={resetForm}>Reset</button>
        </div>
      </form>
    </div>
  );
}
