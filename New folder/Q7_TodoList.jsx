import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, trimmed]);
    setInput("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>To-Do List</h2>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Enter a task..."
        />
        <button style={styles.btn} onClick={addTask}>Add</button>
      </div>
      {tasks.length === 0 ? (
        <p style={styles.empty}>No tasks yet.</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((t, i) => (
            <li key={i} style={styles.item}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "480px", margin: "3rem auto", fontFamily: "sans-serif", padding: "0 1rem" },
  heading: { fontSize: "1.5rem", marginBottom: "1rem" },
  inputRow: { display: "flex", gap: "0.5rem", marginBottom: "1rem" },
  input: { flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.95rem" },
  btn: { padding: "0.5rem 1rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  empty: { color: "#94a3b8", textAlign: "center", marginTop: "1.5rem" },
  list: { listStyle: "none", padding: 0 },
  item: { padding: "0.6rem 0.75rem", borderBottom: "1px solid #f1f5f9", fontSize: "0.95rem" },
};
