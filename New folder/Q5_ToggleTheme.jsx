import React, { useState } from "react";

export default function App() {
  const [dark, setDark] = useState(false);

  const theme = {
    background: dark ? "#1e1e2e" : "#f8fafc",
    color: dark ? "#cdd6f4" : "#1e293b",
  };

  return (
    <div style={{ ...styles.page, ...theme }}>
      <h1 style={styles.heading}>{dark ? "Dark Mode" : "Light Mode"}</h1>
      <p style={styles.sub}>Toggle the button to switch themes.</p>
      <button
        onClick={() => setDark((d) => !d)}
        style={{ ...styles.btn, background: dark ? "#cba6f7" : "#6366f1" }}
      >
        {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", transition: "background 0.3s, color 0.3s" },
  heading: { fontSize: "2rem", marginBottom: "0.5rem" },
  sub: { marginBottom: "1.5rem", opacity: 0.7 },
  btn: { padding: "0.6rem 1.5rem", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" },
};
