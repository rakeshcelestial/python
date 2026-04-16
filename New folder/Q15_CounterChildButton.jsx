import React, { useState, useCallback, memo } from "react";

const IncrementButton = memo(({ onIncrement }) => {
  console.log("IncrementButton rendered");
  return (
    <button style={styles.btn} onClick={onIncrement}>
      Increment Count
    </button>
  );
});

export default function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("light");

  console.log("Parent rendered");

  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#1e1e2e" : "#f8fafc", color: isDark ? "#cdd6f4" : "#1e293b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontFamily: "sans-serif", transition: "all 0.3s" }}>
      <h2>Count: <span style={{ color: "#6366f1" }}>{count}</span></h2>
      <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Toggling the theme does NOT re-render IncrementButton (check console).</p>

      <IncrementButton onIncrement={handleIncrement} />

      <button style={{ ...styles.btn, background: isDark ? "#cba6f7" : "#94a3b8" }} onClick={() => setTheme((t) => t === "light" ? "dark" : "light")}>
        Toggle Theme ({theme})
      </button>
    </div>
  );
}

const styles = {
  btn: { padding: "0.5rem 1.25rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem" },
};
