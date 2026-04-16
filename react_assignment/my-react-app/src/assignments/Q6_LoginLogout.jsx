import React, { useState } from "react";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {loggedIn ? (
          <p style={styles.welcome}>Welcome, User! 👋</p>
        ) : (
          <p style={styles.prompt}>Please log in to continue.</p>
        )}
        <button
          onClick={() => setLoggedIn((v) => !v)}
          style={{ ...styles.btn, background: loggedIn ? "#ef4444" : "#22c55e" }}
        >
          {loggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", background: "#f1f5f9" },
  card: { background: "#fff", padding: "2.5rem 3rem", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" },
  welcome: { fontSize: "1.25rem", fontWeight: 600, color: "#22c55e", marginBottom: "1.25rem" },
  prompt: { fontSize: "1.1rem", color: "#64748b", marginBottom: "1.25rem" },
  btn: { padding: "0.6rem 2rem", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 500 },
};
