// Q12. Protected Dashboard with Fake Auth
// Topics: Protected Routes, Context, JWT, Nested Routes
// Install: npm install react-router-dom

import { createContext, useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

// ─── Auth Context ─────────────────────────────────────────────
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("fake-token");
    const user = localStorage.getItem("fake-user");
    return token ? { token, user } : { token: null, user: null };
  });

  const login = (username, password) => {
    if (!username.trim() || !password.trim()) return false;
    const token = btoa(`${username}:${Date.now()}`); // fake JWT
    localStorage.setItem("fake-token", token);
    localStorage.setItem("fake-user", username);
    setAuthState({ token, user: username });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("fake-token");
    localStorage.removeItem("fake-user");
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── ProtectedRoute ───────────────────────────────────────────
function ProtectedRoute() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}

// ─── Login Page ───────────────────────────────────────────────
function Login() {
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = () => {
    if (!login(username, password)) {
      setError("Username and password are required.");
      return;
    }
    const redirect = location.state?.from || "/dashboard";
    navigate(redirect, { replace: true });
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>🔐 Login</h2>
        <p style={styles.hint}>Any non-empty username/password works.</p>

        <input value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="Username" style={styles.input} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleSubmit} style={styles.loginBtn}>Sign In</button>
      </div>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────
function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/dashboard", label: "🏠 Overview", end: true },
    { to: "/dashboard/profile", label: "👤 Profile" },
    { to: "/dashboard/settings", label: "⚙️ Settings" },
  ];

  return (
    <div style={styles.dashLayout}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBrand}>Dashboard</div>
        <nav style={styles.sidebarNav}>
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                ...styles.sidebarLink,
                ...(isActive ? styles.activeSidebarLink : {}),
              })}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      <div style={styles.content}>
        <div style={styles.topbar}>
          <span>Welcome, <strong>{user}</strong></span>
          <span style={styles.tokenBadge}>
            🔑 {localStorage.getItem("fake-token")?.slice(0, 16)}…
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

// ─── Sub-pages ────────────────────────────────────────────────
function Overview() {
  return (
    <div>
      <h2>Overview</h2>
      <div style={styles.statsGrid}>
        {[["Users", "1,240"], ["Revenue", "$8,430"], ["Orders", "342"], ["Issues", "5"]].map(
          ([label, value]) => (
            <div key={label} style={styles.statCard}>
              <div style={styles.statValue}>{value}</div>
              <div style={styles.statLabel}>{label}</div>
            </div>
          )
        )}
      </div>
      <p style={{ marginTop: 24, color: "#555" }}>
        Navigate using the sidebar. Try visiting a protected route while logged out.
      </p>
    </div>
  );
}

function Profile() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2>My Profile</h2>
      <p>Username: <strong>{user}</strong></p>
      <p>Role: Admin</p>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Notification preferences, theme, and more…</p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f0f4f8", fontFamily: "sans-serif",
  },
  loginCard: {
    background: "#fff", padding: 32, borderRadius: 12,
    border: "1px solid #e0e0e0", width: 340, display: "flex",
    flexDirection: "column", gap: 12,
  },
  hint: { fontSize: 12, color: "#999", textAlign: "center", margin: 0 },
  input: { padding: "10px 12px", fontSize: 14, borderRadius: 8, border: "1px solid #ccc" },
  error: { color: "red", fontSize: 12, margin: 0 },
  loginBtn: {
    padding: "12px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600,
  },
  dashLayout: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
  sidebar: {
    width: 220, background: "#1e1b4b", color: "#fff",
    display: "flex", flexDirection: "column", padding: 16,
  },
  sidebarBrand: { fontWeight: 700, fontSize: 18, padding: "8px 0 24px" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  sidebarLink: {
    color: "rgba(255,255,255,0.7)", textDecoration: "none",
    padding: "10px 12px", borderRadius: 8, fontSize: 14,
  },
  activeSidebarLink: { background: "rgba(255,255,255,0.15)", color: "#fff" },
  logoutBtn: {
    padding: "10px", background: "rgba(239,68,68,0.2)", color: "#fca5a5",
    border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, cursor: "pointer",
  },
  content: { flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 24px", background: "#fff", borderBottom: "1px solid #e0e0e0",
  },
  tokenBadge: { fontSize: 12, color: "#888", background: "#f5f5f5", padding: "4px 10px", borderRadius: 6 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: "20px 24px 0" },
  statCard: { background: "#f0f4ff", borderRadius: 10, padding: 20, textAlign: "center" },
  statValue: { fontSize: 28, fontWeight: 700, color: "#4F46E5" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 4 },
};
