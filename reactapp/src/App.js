import React, { useEffect, useState, useCallback } from "react";
import IdeaForm from "./components/IdeaForm";
import ValidationBoard from "./components/ValidationBoard";
import { getIdeas, getValidatedIdeas, deleteIdea } from "./services/api";
//import "./index.css";

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = viewMode === "validated"
        ? await getValidatedIdeas()
        : await getIdeas();
      setIdeas(res || []);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleOnAdd = () => {
    fetchIdeas();
  };

  const handleDelete = async (id) => {
    try {
      await deleteIdea(id);
      fetchIdeas();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete idea.");
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div>
          <h1>Startup Idea Validation Portal</h1>
          <div className="small-muted">Collect, rate and validate startup ideas</div>
        </div>

        <div className="controls">
          <label className="small-muted" htmlFor="viewMode">View:</label>
          <select
            id="viewMode"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="all">All Ideas</option>
            <option value="validated">Validated Ideas</option>
          </select>
          <button className="btn-secondary" onClick={fetchIdeas} title="Refresh">
            Refresh
          </button>
        </div>
      </div>

      <IdeaForm onAdd={handleOnAdd} />

      {loading ? (
        <div className="card small-muted">Loading...</div>
      ) : (
        <ValidationBoard ideas={ideas} viewMode={viewMode} onDelete={handleDelete} />
      )}
    </div>
  );
}
