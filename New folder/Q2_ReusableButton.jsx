import React from "react";

function Button({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1.25rem",
        backgroundColor: color,
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );
}

export default function App() {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "2rem", fontFamily: "sans-serif" }}>
      <Button label="Save" color="#22c55e" onClick={() => alert("Saved!")} />
      <Button label="Cancel" color="#94a3b8" onClick={() => alert("Cancelled!")} />
      <Button label="Delete" color="#ef4444" onClick={() => alert("Deleted!")} />
    </div>
  );
}
