import React, { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error("Request failed"); return r.json(); })
      .then((data) => { setUsers(data); setLoading(false); })
      .catch((err) => { if (err.name !== "AbortError") { setError(err.message); setLoading(false); } });

    return () => controller.abort();
  }, [tick]);

  return (
    <div style={{ maxWidth: "500px", margin: "3rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Users</h2>
        <button style={styles.btn} onClick={() => setTick((t) => t + 1)}>Refresh</button>
      </div>

      {loading && <p style={{ color: "#6366f1" }}>Loading...</p>}
      {error && <p style={{ color: "#ef4444" }}>Error: {error}</p>}
      {!loading && !error && (
        <ul style={styles.list}>
          {users.map((u) => (
            <li key={u.id} style={styles.item}>
              <strong>{u.name}</strong>
              <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{u.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  btn: { padding: "0.4rem 0.9rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  list: { listStyle: "none", padding: 0 },
  item: { display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #f1f5f9" },
};
