import React, { useState, useMemo } from "react";

function countPrimes(n) {
  if (n < 2) return 0;
  const sieve = new Array(n + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= n; j += i) sieve[j] = false;
    }
  }
  return sieve.filter(Boolean).length;
}

export default function App() {
  const [n, setN] = useState(100);
  const [theme, setTheme] = useState("light");

  const primeCount = useMemo(() => {
    console.log("Computing primes...");
    return countPrimes(Number(n));
  }, [n]);

  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#1e1e2e" : "#f8fafc", color: isDark ? "#cdd6f4" : "#1e293b", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", transition: "all 0.3s" }}>
      <h2>Prime Number Calculator <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>(useMemo)</span></h2>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <label>N:</label>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(e.target.value)}
          style={{ padding: "0.4rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", width: "120px", background: isDark ? "#313244" : "#fff", color: "inherit" }}
        />
        <button onClick={() => setTheme((t) => t === "light" ? "dark" : "light")} style={styles.btn}>
          Toggle theme
        </button>
      </div>

      <p style={{ fontSize: "1.1rem" }}>
        Primes from 1 to {n}: <strong style={{ color: "#6366f1" }}>{primeCount}</strong>
      </p>
    </div>
  );
}

const styles = {
  btn: { padding: "0.4rem 0.9rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
};
