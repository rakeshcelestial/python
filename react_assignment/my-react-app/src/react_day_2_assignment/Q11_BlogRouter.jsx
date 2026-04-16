// Q11. Multi-Page Blog with React Router
// Topics: React Router, Dynamic Routes, useNavigate
// Install: npm install react-router-dom

import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  NavLink,
  Link,
  Outlet,
  useParams,
  useNavigate,
} from "react-router-dom";

const API = "https://jsonplaceholder.typicode.com/posts";

// ─── Layout with NavBar ───────────────────────────────────────
function Layout() {
  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <span style={styles.brand}>📖 My Blog</span>
        <div style={styles.navLinks}>
          {[{ to: "/", label: "Home", end: true }, { to: "/about", label: "About" }].map(
            ({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.activeLink : {}),
                })}
              >
                {label}
              </NavLink>
            )
          )}
        </div>
      </nav>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────
function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => setPosts(data.slice(0, 12)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.loading}>Loading posts…</p>;

  return (
    <div>
      <h2>Latest Posts</h2>
      <div style={styles.postGrid}>
        {posts.map((post) => (
          <Link key={post.id} to={`/posts/${post.id}`} style={styles.postCard}>
            <span style={styles.postNum}>#{post.id}</span>
            <strong style={styles.postTitle}>{post.title}</strong>
            <span style={styles.postExcerpt}>{post.body.slice(0, 80)}…</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Post Detail Page ─────────────────────────────────────────
function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/${id}`)
      .then((r) => r.json())
      .then(setPost)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={styles.loading}>Loading post…</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <article style={styles.article}>
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        ← Back to Home
      </button>
      <span style={styles.postNum}>Post #{post.id}</span>
      <h1 style={styles.articleTitle}>{post.title}</h1>
      <p style={styles.articleBody}>{post.body}</p>
    </article>
  );
}

// ─── About Page ───────────────────────────────────────────────
function About() {
  return (
    <div style={styles.article}>
      <h2>About This Blog</h2>
      <p style={{ lineHeight: 1.7, color: "#555" }}>
        This is a demo blog built with React Router. It demonstrates dynamic
        routing, NavLink active styling, programmatic navigation, and a 404 page.
        Data is fetched from JSONPlaceholder.
      </p>
    </div>
  );
}

// ─── 404 Page ─────────────────────────────────────────────────
function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={styles.notFound}>
      <h1 style={styles.notFoundCode}>404</h1>
      <p>Oops! Page not found.</p>
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        Go Home
      </button>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

// ─── Styles ───────────────────────────────────────────────────
const styles = {
  app: { fontFamily: "sans-serif", minHeight: "100vh" },
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 24px", background: "#4F46E5", color: "#fff",
    position: "sticky", top: 0, zIndex: 10,
  },
  brand: { fontWeight: 700, fontSize: 18 },
  navLinks: { display: "flex", gap: 8 },
  navLink: {
    color: "rgba(255,255,255,0.8)", textDecoration: "none",
    padding: "6px 14px", borderRadius: 6, fontSize: 14,
  },
  activeLink: { background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 },
  main: { maxWidth: 900, margin: "0 auto", padding: "24px 16px" },
  loading: { color: "#4F46E5", fontStyle: "italic" },
  postGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
  postCard: {
    display: "flex", flexDirection: "column", gap: 6, padding: 16,
    border: "1px solid #e0e0e0", borderRadius: 10,
    textDecoration: "none", color: "inherit",
    transition: "box-shadow 0.2s",
  },
  postNum: { fontSize: 11, color: "#4F46E5", fontWeight: 600 },
  postTitle: { fontSize: 14, lineHeight: 1.4 },
  postExcerpt: { fontSize: 12, color: "#888" },
  article: { maxWidth: 680 },
  articleTitle: { fontSize: 26, fontWeight: 700, margin: "12px 0" },
  articleBody: { fontSize: 16, lineHeight: 1.8, color: "#555" },
  backBtn: {
    padding: "8px 16px", background: "#f0f0f0", border: "none",
    borderRadius: 6, cursor: "pointer", fontSize: 14, marginBottom: 16,
  },
  notFound: { textAlign: "center", paddingTop: 60 },
  notFoundCode: { fontSize: 80, color: "#4F46E5", margin: 0 },
};
