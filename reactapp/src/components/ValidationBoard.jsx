import React from "react";
//import "../styles/ValidationBoard.css";

export default function ValidationBoard({ ideas, viewMode, onDelete }) {
  const isValidatedView = viewMode === "validated";

  return (
    <div className="card ValidationBoard-card">
      <h3>{isValidatedView ? "Validated Ideas" : "All Ideas"}</h3>

      {(!ideas || ideas.length === 0) ? (
        <div className="small-muted">No ideas to display.</div>
      ) : (
        <div className="table-wrap">
          <table className="validation-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>{isValidatedView ? "Average Score" : "Target Market"}</th>
                <th>{isValidatedView ? "Feedback" : "Estimated Budget (USD)"}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((item, idx) => (
                <tr key={item.id ?? (item.ideaTitle ? item.ideaTitle + "-" + idx : idx)}>
                  <td className="title-cell">
                    <div className="idea-title">{item.ideaTitle}</div>
                    {!isValidatedView && item.description && (
                      <div className="small-muted desc">
                        {item.description.slice(0, 120)}
                        {item.description.length > 120 ? "..." : ""}
                      </div>
                    )}
                  </td>

                  <td>
                    {isValidatedView ? (item.averageScore ?? "-") : (item.targetMarket ?? "-")}
                  </td>

                  <td>
                    {isValidatedView ? (item.feedback ?? "-") : (item.estimatedBudget ?? 0)}
                  </td>

                  <td>
                    {!isValidatedView && item.id ? (
                      <button className="btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
                    ) : (
                      <span className="small-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}