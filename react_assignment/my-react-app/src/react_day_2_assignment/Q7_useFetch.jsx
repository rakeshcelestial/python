// Q7. useFetch Custom Hook
// Topics: Custom Hooks, Fetch API, AbortController

import { useState, useEffect, useCallback } from "react";

// ─── Custom Hook ──────────────────────────────────────────────
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0); // trigger refetch

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // cleanup on unmount / url change
  }, [url, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, refetch };
}

// ─── Component 1: User List ───────────────────────────────────
function UserList() {
  const { data: users, loading, error, refetch } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={{ margin: 0 }}>👤 Users</h3>
        <button onClick={refetch} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      {loading && <p style={styles.loading}>Loading users…</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}
      {users && (
        <ul style={styles.list}>
          {users.map((u) => (
            <li key={u.id} style={styles.listItem}>
              <strong>{u.name}</strong>
              <span style={styles.sub}>{u.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Component 2: Post List ───────────────────────────────────
function PostList() {
  const { data: posts, loading, error, refetch } = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={{ margin: 0 }}>📝 Posts (first 5)</h3>
        <button onClick={refetch} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      {loading && <p style={styles.loading}>Loading posts…</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}
      {posts && (
        <ul style={styles.list}>
          {posts.slice(0, 5).map((p) => (
            <li key={p.id} style={styles.listItem}>
              <strong>{p.title}</strong>
              <span style={styles.sub}>{p.body.slice(0, 60)}…</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <div style={styles.container}>
      <h2>useFetch Hook Demo — Reusability</h2>
      <div style={styles.grid}>
        <UserList />
        <PostList />
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  card: { border: "1px solid #e0e0e0", borderRadius: 10, padding: 16, background: "#fff" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  refreshBtn: {
    padding: "5px 12px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13,
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  listItem: {
    display: "flex", flexDirection: "column", padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  sub: { fontSize: 12, color: "#888", marginTop: 2 },
  loading: { color: "#4F46E5", fontStyle: "italic" },
  errorText: { color: "red" },
};
