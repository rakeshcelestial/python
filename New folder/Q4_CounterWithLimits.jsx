import React, { useState } from "react";

const MIN = 0;
const MAX = 10;

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Counter</h2>
      <p style={styles.value}>{count}</p>

      {count === MAX && <p style={styles.msg}>Maximum reached!</p>}
      {count === MIN && <p style={styles.msg}>Minimum reached!</p>}

      <div style={styles.btnRow}>
        <button style={styles.btn} onClick={() => setCount((c) => c - 1)} disabled={count === MIN}>
          Decrement
        </button>
        <button style={{ ...styles.btn, background: "#94a3b8" }} onClick={() => setCount(0)}>
          Reset
        </button>
        <button style={{ ...styles.btn, background: "#22c55e" }} onClick={() => setCount((c) => c + 1)} disabled={count === MAX}>
          Increment
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "sans-serif", textAlign: "center", padding: "3rem" },
  heading: { fontSize: "1.5rem", marginBottom: "1rem" },
  value: { fontSize: "4rem", fontWeight: 700, color: "#6366f1", margin: "0 0 0.5rem" },
  msg: { color: "#ef4444", marginBottom: "0.75rem", fontSize: "0.9rem" },
  btnRow: { display: "flex", gap: "0.75rem", justifyContent: "center" },
  btn: { padding: "0.5rem 1.25rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", opacity: 1 },
};
