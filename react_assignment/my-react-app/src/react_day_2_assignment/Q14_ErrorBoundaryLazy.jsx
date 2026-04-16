// Q14. Error Boundary + Lazy Loading
// Topics: Error Boundaries, React.lazy, Suspense

import { lazy, Suspense, Component, useState } from "react";

// ─── Class-Based Error Boundary ───────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Something went wrong</h3>
          <p style={styles.errorMsg}>{this.state.error?.message}</p>
          <button onClick={this.handleReset} style={styles.retryBtn}>
            ↻ Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Skeleton Fallback ─────────────────────────────────────────
function Skeleton({ label }) {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skeletonBar} />
      <div style={{ ...styles.skeletonBar, width: "60%", marginTop: 8 }} />
      <div style={{ ...styles.skeletonBar, width: "80%", marginTop: 8 }} />
      <p style={styles.skeletonLabel}>Loading {label}…</p>
    </div>
  );
}

// ─── Lazy-Loaded Components ───────────────────────────────────
// In a real app these would be separate files loaded via React.lazy(() => import('./Page'))
// Here we define them inline and simulate lazy loading with a dynamic import factory

function HomePage() {
  return (
    <div style={styles.page}>
      <h2>🏠 Home Page</h2>
      <p>This component was lazy-loaded. It loads only when first visited.</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={styles.page}>
      <h2>ℹ️ About Page</h2>
      <p>Another lazy-loaded route. Each route has its own Error Boundary.</p>
    </div>
  );
}

// This component intentionally throws to demonstrate the Error Boundary
function BuggyPage() {
  throw new Error("BuggyPage intentionally threw an error!");
}

// Simulated lazy imports (real code would use: const Home = lazy(() => import('./HomePage')))
const LazyHome = lazy(() => Promise.resolve({ default: HomePage }));
const LazyAbout = lazy(() => Promise.resolve({ default: AboutPage }));
const LazyBuggy = lazy(() => Promise.resolve({ default: BuggyPage }));

const routes = [
  { id: "home", label: "Home", Component: LazyHome },
  { id: "about", label: "About", Component: LazyAbout },
  { id: "buggy", label: "💥 Buggy Page", Component: LazyBuggy },
];

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("home");
  const [resetKeys, setResetKeys] = useState({});

  const handleReset = (id) => {
    setResetKeys((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        {routes.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={active === id ? { ...styles.navBtn, ...styles.activeNavBtn } : styles.navBtn}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={styles.content}>
        <p style={styles.info}>
          Each route is wrapped in its own <code>{"<ErrorBoundary>"}</code> and{" "}
          <code>{"<Suspense>"}</code>. The Buggy Page will trigger the boundary.
        </p>

        {routes.map(({ id, Component }) => (
          <div key={id} style={{ display: active === id ? "block" : "none" }}>
            <ErrorBoundary
              key={resetKeys[id] || 0}
              onReset={() => handleReset(id)}
            >
              <Suspense fallback={<Skeleton label={id} />}>
                <Component />
              </Suspense>
            </ErrorBoundary>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  app: { maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  nav: { display: "flex", gap: 8, marginBottom: 20 },
  navBtn: {
    padding: "8px 16px", background: "#f0f0f0", border: "1px solid #ccc",
    borderRadius: 8, cursor: "pointer", fontSize: 14,
  },
  activeNavBtn: { background: "#4F46E5", color: "#fff", border: "1px solid #4F46E5" },
  content: { minHeight: 200 },
  info: { color: "#666", fontSize: 13, marginBottom: 16, fontStyle: "italic" },
  page: {
    background: "#f8f9ff", border: "1px solid #dde", borderRadius: 10,
    padding: 24, lineHeight: 1.6, color: "#333",
  },
  errorBox: {
    background: "#fff5f5", border: "2px solid #fca5a5", borderRadius: 10,
    padding: 24, textAlign: "center",
  },
  errorIcon: { fontSize: 40 },
  errorTitle: { color: "#dc2626", margin: "8px 0 4px" },
  errorMsg: { color: "#ef4444", fontSize: 14, fontFamily: "monospace" },
  retryBtn: {
    marginTop: 12, padding: "10px 20px", background: "#ef4444", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
  },
  skeleton: {
    background: "#f9fafb", border: "1px solid #eee", borderRadius: 10,
    padding: 24,
  },
  skeletonBar: {
    height: 16, background: "linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)",
    backgroundSize: "200% 100%", borderRadius: 6, animation: "pulse 1.5s infinite",
    width: "100%",
  },
  skeletonLabel: { color: "#aaa", fontSize: 12, marginTop: 12, textAlign: "center" },
};
