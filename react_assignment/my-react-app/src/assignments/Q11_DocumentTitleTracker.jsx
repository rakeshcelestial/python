import React, { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
    return () => { document.title = "React App"; };
  }, [count]);

  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Document Title Tracker</h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>The browser tab title updates with every count change.</p>
      <p style={{ fontSize: "3rem", fontWeight: 700, color: "#6366f1", margin: "0 0 1.5rem" }}>{count}</p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
        <button style={styles.btn} onClick={() => setCount((c) => c - 1)}>–</button>
        <button style={{ ...styles.btn, background: "#22c55e" }} onClick={() => setCount((c) => c + 1)}>+</button>
      </div>
    </div>
  );
}

const styles = {
  btn: { padding: "0.5rem 1.25rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1.1rem" },
};
