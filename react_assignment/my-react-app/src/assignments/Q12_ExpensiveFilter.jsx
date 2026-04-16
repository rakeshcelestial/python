import React, { useState, useMemo } from "react";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Furniture"];

const allProducts = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: parseFloat((Math.random() * 200 + 5).toFixed(2)),
  category: CATEGORIES[1 + (i % 4)],
}));

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [counter, setCounter] = useState(0);

  const filtered = useMemo(() => {
    console.log("Filtering...");
    return allProducts.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <div style={{ maxWidth: "680px", margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h2>Product Filter <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>(useMemo)</span></h2>

      <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0", flexWrap: "wrap" }}>
        <input
          style={styles.input}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button style={styles.btn} onClick={() => setCounter((c) => c + 1)}>
          Unrelated counter: {counter}
        </button>
      </div>

      <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        Showing {filtered.length} results
      </p>

      <ul style={styles.list}>
        {filtered.slice(0, 20).map((p) => (
          <li key={p.id} style={styles.item}>
            <span>{p.name}</span>
            <span style={{ color: "#6366f1", fontWeight: 600 }}>${p.price}</span>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{p.category}</span>
          </li>
        ))}
      </ul>
      {filtered.length > 20 && <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>...and {filtered.length - 20} more</p>}
    </div>
  );
}

const styles = {
  input: { padding: "0.4rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.9rem" },
  btn: { padding: "0.4rem 0.9rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer" },
  list: { listStyle: "none", padding: 0 },
  item: { display: "flex", gap: "1rem", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem" },
};
