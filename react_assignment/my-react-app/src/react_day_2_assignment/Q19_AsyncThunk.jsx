// Q19. Async Users Fetcher with createAsyncThunk
// Topics: createAsyncThunk, Async State, extraReducers
// Install: npm install @reduxjs/toolkit react-redux

import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

// ─── Async Thunk ──────────────────────────────────────────────
export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// ─── Slice ────────────────────────────────────────────────────
const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle",   // idle | loading | success | error
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearUsers: (state) => {
      state.list = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.list = action.payload;
        state.lastFetched = new Date().toLocaleTimeString();
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Unknown error";
      });
  },
});

const { clearUsers } = usersSlice.actions;

// ─── Store ────────────────────────────────────────────────────
const store = configureStore({ reducer: { users: usersSlice.reducer } });

// ─── Spinner ──────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={styles.spinnerWrapper}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Fetching users…</p>
    </div>
  );
}

// ─── User Card ────────────────────────────────────────────────
function UserCard({ user }) {
  return (
    <div style={styles.card}>
      <div style={styles.avatar}>{user.name.charAt(0)}</div>
      <div style={styles.info}>
        <strong style={styles.name}>{user.name}</strong>
        <span style={styles.email}>{user.email}</span>
        <span style={styles.company}>{user.company.name}</span>
      </div>
      <div style={styles.meta}>
        <a href={`https://${user.website}`} target="_blank" rel="noreferrer"
          style={styles.link}>
          🌐 {user.website}
        </a>
        <span style={styles.city}>📍 {user.address.city}</span>
      </div>
    </div>
  );
}

// ─── Users List Component ─────────────────────────────────────
function UsersList() {
  const dispatch = useDispatch();
  const { list, status, error, lastFetched } = useSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>👥 Async Users — createAsyncThunk</h2>
        <div style={styles.headerActions}>
          {lastFetched && (
            <span style={styles.lastFetched}>Last fetched: {lastFetched}</span>
          )}
          <button
            onClick={() => dispatch(fetchUsers())}
            disabled={status === "loading"}
            style={status === "loading" ? styles.disabledBtn : styles.refreshBtn}
          >
            {status === "loading" ? "Loading…" : "↻ Refresh"}
          </button>
          {status === "success" && (
            <button onClick={() => dispatch(clearUsers())} style={styles.clearBtn}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div style={styles.statusBanner(status)}>
        {status === "idle" && "🟡 Idle — click Refresh to load users"}
        {status === "loading" && "🔵 Fetching from API…"}
        {status === "success" && `🟢 Loaded ${list.length} users`}
        {status === "error" && `🔴 Error: ${error}`}
      </div>

      {/* Content */}
      {status === "loading" && <Spinner />}

      {status === "error" && (
        <div style={styles.errorBox}>
          <h3>Something went wrong</h3>
          <p style={styles.errorMsg}>{error}</p>
          <button onClick={() => dispatch(fetchUsers())} style={styles.retryBtn}>
            Try Again
          </button>
        </div>
      )}

      {status === "success" && (
        <div style={styles.grid}>
          {list.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <UsersList />
    </Provider>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const statusColors = {
  idle: "#fffde7",
  loading: "#eff6ff",
  success: "#f0fdf4",
  error: "#fff5f5",
};

const styles = {
  container: { maxWidth: 860, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  headerActions: { display: "flex", alignItems: "center", gap: 10 },
  lastFetched: { fontSize: 12, color: "#888" },
  refreshBtn: {
    padding: "8px 16px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer",
  },
  clearBtn: {
    padding: "8px 14px", background: "#f0f0f0", color: "#666",
    border: "none", borderRadius: 8, cursor: "pointer",
  },
  disabledBtn: {
    padding: "8px 16px", background: "#ccc", color: "#fff",
    border: "none", borderRadius: 8, cursor: "not-allowed",
  },
  statusBanner: (status) => ({
    padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 16,
    background: statusColors[status] || "#f9f9f9",
  }),
  spinnerWrapper: { display: "flex", flexDirection: "column", alignItems: "center", padding: 40 },
  spinner: {
    width: 40, height: 40, border: "4px solid #e0e0e0",
    borderTop: "4px solid #4F46E5", borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#4F46E5", marginTop: 12, fontStyle: "italic" },
  errorBox: {
    textAlign: "center", padding: 32, background: "#fff5f5",
    border: "1px solid #fca5a5", borderRadius: 10,
  },
  errorMsg: { color: "#ef4444", fontFamily: "monospace", fontSize: 14 },
  retryBtn: {
    padding: "10px 20px", background: "#ef4444", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14,
  },
  card: {
    border: "1px solid #e0e0e0", borderRadius: 10, padding: 14,
    display: "flex", gap: 12, background: "#fff",
  },
  avatar: {
    width: 44, height: 44, borderRadius: "50%", background: "#4F46E5",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 18, flexShrink: 0,
  },
  info: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  name: { fontSize: 14 },
  email: { fontSize: 12, color: "#4F46E5" },
  company: { fontSize: 11, color: "#888" },
  meta: { display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" },
  link: { fontSize: 11, color: "#10B981", textDecoration: "none" },
  city: { fontSize: 11, color: "#888" },
};
