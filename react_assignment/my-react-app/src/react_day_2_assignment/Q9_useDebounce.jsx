// Q9. useDebounce + Search
// Topics: Custom Hooks, Debouncing, API Integration

import { useState, useEffect } from "react";

// ─── useDebounce Hook ─────────────────────────────────────────
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // reset timer on every value change
  }, [value, delay]);

  return debouncedValue;
}

// ─── User Search Component ────────────────────────────────────
export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setUsers([]);
      setSearched(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setSearched(true);

    // JSONPlaceholder doesn't support real search params,
    // so we fetch all and filter client-side to simulate API search
    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        const q = debouncedQuery.toLowerCase();
        const filtered = data.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q)
        );
        setUsers(filtered);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError("Failed to fetch users.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div style={styles.container}>
      <h2>🔍 User Search</h2>
      <p style={styles.hint}>
        Searches only after 500ms pause — debounced to avoid excessive API calls.
      </p>

      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or username…"
          style={styles.input}
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} style={styles.clearBtn}>✕</button>
        )}
      </div>

      {/* Status display */}
      {query !== debouncedQuery && (
        <p style={styles.waiting}>⏳ Waiting for you to stop typing…</p>
      )}
      {loading && <p style={styles.loadingText}>Loading…</p>}
      {error && <p style={styles.errorText}>{error}</p>}
      {!loading && searched && users.length === 0 && (
        <p style={styles.noResult}>No users found for "{debouncedQuery}"</p>
      )}

      {/* Results */}
      {users.length > 0 && (
        <div>
          <p style={styles.resultCount}>{users.length} result(s) found</p>
          <div style={styles.resultList}>
            {users.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.avatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{highlightMatch(user.name, debouncedQuery)}</strong>
                  <div style={styles.sub}>
                    @{user.username} · {user.email}
                  </div>
                  <div style={styles.sub}>{user.company.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper: highlight matching text ─────────────────────────
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ background: "#fef08a", padding: "0 2px" }}>
        {part}
      </mark>
    ) : part
  );
}

const styles = {
  container: { maxWidth: 540, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  hint: { color: "#888", fontSize: 13 },
  searchWrapper: {
    position: "relative", display: "flex", alignItems: "center",
    border: "2px solid #4F46E5", borderRadius: 10, overflow: "hidden",
    marginBottom: 12,
  },
  searchIcon: { padding: "0 12px", fontSize: 16 },
  input: {
    flex: 1, padding: "12px 8px", fontSize: 15,
    border: "none", outline: "none", fontFamily: "inherit",
  },
  clearBtn: {
    padding: "0 12px", background: "none", border: "none",
    cursor: "pointer", fontSize: 16, color: "#888",
  },
  waiting: { color: "#f59e0b", fontSize: 13 },
  loadingText: { color: "#4F46E5", fontStyle: "italic" },
  errorText: { color: "red" },
  noResult: { color: "#888", textAlign: "center", marginTop: 24 },
  resultCount: { color: "#4F46E5", fontSize: 13, marginBottom: 8 },
  resultList: { display: "flex", flexDirection: "column", gap: 10 },
  userCard: {
    display: "flex", alignItems: "center", gap: 14, padding: 12,
    border: "1px solid #e0e0e0", borderRadius: 10, background: "#fafafa",
  },
  avatar: {
    width: 44, height: 44, borderRadius: "50%",
    background: "#4F46E5", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 18, flexShrink: 0,
  },
  sub: { fontSize: 12, color: "#666", marginTop: 2 },
};
