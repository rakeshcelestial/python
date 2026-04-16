// Q18. Redux Auth Slice with Protected Routes
// Topics: Redux Toolkit, Auth Flow, Protected Routes, Persistence
// Install: npm install @reduxjs/toolkit react-redux react-router-dom

import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
  NavLink,
} from "react-router-dom";
import { useState } from "react";

// ─── Auth Slice ───────────────────────────────────────────────
const persistedAuth = (() => {
  try {
    const raw = localStorage.getItem("redux-auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: persistedAuth || { user: null, isAuthenticated: false, token: null },
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("redux-auth", JSON.stringify(state));
    },
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("redux-auth");
    },
  },
});

const { loginAction, logoutAction } = authSlice.actions;

// ─── Store ────────────────────────────────────────────────────
const store = configureStore({ reducer: { auth: authSlice.reducer } });

// ─── ProtectedRoute (reads from Redux) ───────────────────────
function ProtectedRoute() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const location = useLocation();
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

// ─── Login Page ───────────────────────────────────────────────
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("Both fields are required.");
      return;
    }
    dispatch(loginAction({ user: username, token: btoa(`${username}:${Date.now()}`) }));
    navigate(location.state?.from || "/dashboard", { replace: true });
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        <h2>🔐 Sign In</h2>
        <p style={styles.hint}>State is stored in Redux + persisted to localStorage.</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="Username" style={styles.input} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={handleLogin} style={styles.loginBtn}>Login</button>
      </div>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────
function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>App</div>
        {[
          { to: "/dashboard", label: "Overview", end: true },
          { to: "/dashboard/profile", label: "Profile" },
          { to: "/dashboard/settings", label: "Settings" },
        ].map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeLink : {}),
            })}>
            {label}
          </NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <span>👤 {user}</span>
          <code style={styles.tokenDisplay}>
            token: {token?.slice(0, 20)}…
          </code>
        </div>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ─── Sub-Pages ────────────────────────────────────────────────
function Overview() {
  const { user } = useSelector((s) => s.auth);
  return (
    <div>
      <h2>Welcome, {user}!</h2>
      <p>Your auth state lives in Redux and survives page refresh.</p>
    </div>
  );
}
function Profile() {
  const { user } = useSelector((s) => s.auth);
  return <div><h2>Profile</h2><p>Username: <strong>{user}</strong></p></div>;
}
function Settings() {
  return <div><h2>Settings</h2><p>App preferences and configuration.</p></div>;
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f0f4f8", fontFamily: "sans-serif",
  },
  loginCard: {
    background: "#fff", padding: 32, borderRadius: 12, border: "1px solid #e0e0e0",
    width: 340, display: "flex", flexDirection: "column", gap: 12,
  },
  hint: { fontSize: 12, color: "#999", margin: 0 },
  input: { padding: "10px 12px", fontSize: 14, borderRadius: 8, border: "1px solid #ccc" },
  error: { color: "red", fontSize: 12, margin: 0 },
  loginBtn: {
    padding: 12, background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600,
  },
  layout: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
  sidebar: {
    width: 200, background: "#1e1b4b", color: "#fff",
    display: "flex", flexDirection: "column", padding: 16, gap: 4,
  },
  brand: { fontWeight: 700, fontSize: 18, padding: "8px 0 20px" },
  navLink: {
    color: "rgba(255,255,255,0.65)", textDecoration: "none",
    padding: "9px 12px", borderRadius: 8, fontSize: 14,
  },
  activeLink: { background: "rgba(255,255,255,0.15)", color: "#fff" },
  logoutBtn: {
    padding: "9px 12px", background: "transparent", color: "#fca5a5",
    border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, cursor: "pointer",
  },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 24px", background: "#fff", borderBottom: "1px solid #e0e0e0",
    fontSize: 14,
  },
  tokenDisplay: { fontSize: 11, color: "#888", background: "#f5f5f5", padding: "3px 8px", borderRadius: 4 },
  content: { padding: 24 },
};
