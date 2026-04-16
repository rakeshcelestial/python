// Q15. Optimized Large List with React.memo + useCallback + useMemo
// Topics: React.memo, useCallback, useMemo, Performance

import { useState, useCallback, useMemo, memo } from "react";

// ─── Generate 1000 users ──────────────────────────────────────
const initialUsers = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(4, "0")}`,
  role: ["Developer", "Designer", "Manager", "Analyst"][i % 4],
  likes: 0,
}));

// ─── UserCard — memo prevents re-render unless props change ──
const UserCard = memo(function UserCard({ user, onLike }) {
  console.log(`[render] UserCard #${user.id}`); // verify selective re-render in console

  return (
    <div style={styles.card}>
      <div style={styles.avatar}>
        {user.name.charAt(5)}
      </div>
      <div style={styles.info}>
        <strong style={styles.name}>{user.name}</strong>
        <span style={styles.role}>{user.role}</span>
      </div>
      <div style={styles.likeSection}>
        <span style={styles.likeCount}>{user.likes}</span>
        <button onClick={() => onLike(user.id)} style={styles.likeBtn}>
          ♥ Like
        </button>
      </div>
    </div>
  );
});

// ─── Main App ──────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");

  // useCallback: stable reference so UserCard doesn't re-render when parent renders
  const handleLike = useCallback((id) => {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, likes: u.likes + 1 } : u)
    );
  }, []); // empty deps — setUsers is stable

  // useMemo: only recompute filtered list when users or query changes
  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  const totalLikes = useMemo(
    () => users.reduce((sum, u) => sum + u.likes, 0),
    [users]
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Optimized List — {users.length} users</h2>
        <div style={styles.stats}>
          <span style={styles.stat}>Showing: <strong>{filteredUsers.length}</strong></span>
          <span style={styles.stat}>Total Likes: <strong>{totalLikes}</strong></span>
        </div>
      </div>

      <div style={styles.searchWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or role…"
          style={styles.searchInput}
        />
        {query && (
          <button onClick={() => setQuery("")} style={styles.clearBtn}>✕</button>
        )}
      </div>

      <div style={styles.perf}>
        💡 Open DevTools console to verify only the liked card re-renders.
      </div>

      {filteredUsers.length === 0 ? (
        <p style={styles.noResult}>No users match "{query}"</p>
      ) : (
        <div style={styles.list}>
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
}

const roleColors = {
  Developer: "#dbeafe",
  Designer: "#fce7f3",
  Manager: "#d1fae5",
  Analyst: "#fef3c7",
};

const styles = {
  container: { maxWidth: 680, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  stats: { display: "flex", gap: 16 },
  stat: { fontSize: 14, color: "#666" },
  searchWrapper: {
    display: "flex", alignItems: "center",
    border: "2px solid #4F46E5", borderRadius: 10, overflow: "hidden", marginBottom: 12,
  },
  searchInput: {
    flex: 1, padding: "10px 14px", fontSize: 14,
    border: "none", outline: "none", fontFamily: "inherit",
  },
  clearBtn: {
    padding: "0 12px", background: "none",
    border: "none", cursor: "pointer", fontSize: 16, color: "#888",
  },
  perf: {
    background: "#fffde7", border: "1px solid #f0e68c",
    borderRadius: 8, padding: "8px 12px", fontSize: 12,
    color: "#795548", marginBottom: 12,
  },
  noResult: { textAlign: "center", color: "#aaa", marginTop: 40 },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  card: {
    display: "flex", alignItems: "center", gap: 12, padding: 12,
    border: "1px solid #e0e0e0", borderRadius: 10, background: "#fff",
  },
  avatar: {
    width: 40, height: 40, borderRadius: "50%", background: "#4F46E5",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  info: { flex: 1, display: "flex", flexDirection: "column" },
  name: { fontSize: 14 },
  role: {
    fontSize: 11, marginTop: 2, padding: "2px 8px", borderRadius: 10,
    background: "#f0f0f0", width: "fit-content",
  },
  likeSection: { display: "flex", alignItems: "center", gap: 8 },
  likeCount: { minWidth: 24, textAlign: "center", fontWeight: 600, color: "#e11d48" },
  likeBtn: {
    padding: "6px 12px", background: "#fff0f3", color: "#e11d48",
    border: "1px solid #fecdd3", borderRadius: 8, cursor: "pointer", fontSize: 13,
  },
};
