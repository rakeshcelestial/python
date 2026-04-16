// Q10. Stopwatch with useRef
// Topics: useRef, setInterval, State Management

import { useState, useRef } from "react";

// ─── Helpers ──────────────────────────────────────────────────
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

// ─── Stopwatch ────────────────────────────────────────────────
export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  const intervalRef = useRef(null);   // holds setInterval ID — persists across renders
  const startTimeRef = useRef(0);    // records when the timer was started/resumed

  const start = () => {
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
    setRunning(true);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setElapsed(0);
    setRunning(false);
    setLaps([]);
  };

  const lap = () => {
    setLaps((prev) => [...prev, elapsed]);
  };

  // Best / worst lap highlighting
  const minLap = laps.length > 1 ? Math.min(...laps) : null;
  const maxLap = laps.length > 1 ? Math.max(...laps) : null;

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>⏱ Stopwatch</h2>

      {/* Display */}
      <div style={styles.display}>
        {formatTime(elapsed)}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {!running ? (
          <button onClick={start} style={{ ...styles.btn, background: "#10B981" }}>
            {elapsed > 0 ? "▶ Resume" : "▶ Start"}
          </button>
        ) : (
          <button onClick={pause} style={{ ...styles.btn, background: "#f59e0b" }}>
            ⏸ Pause
          </button>
        )}
        <button onClick={lap} disabled={!running} style={styles.btn}>
          🏁 Lap
        </button>
        <button onClick={reset} style={{ ...styles.btn, background: "#ef4444" }}>
          ↺ Reset
        </button>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <div style={styles.lapsContainer}>
          <h3 style={{ marginBottom: 8, fontSize: 14, color: "#555" }}>
            Lap Times ({laps.length})
          </h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Lap Time</th>
                <th style={styles.th}>+/−</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, i) => {
                const diff = i > 0 ? lap - laps[i - 1] : null;
                const isBest = lap === minLap;
                const isWorst = lap === maxLap;
                return (
                  <tr
                    key={i}
                    style={{
                      background: isBest ? "#d1fae5" : isWorst ? "#fee2e2" : "transparent",
                    }}
                  >
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontWeight: 600 }}>
                      {formatTime(lap)}
                      {isBest && <span style={styles.badge("#10B981")}>Best</span>}
                      {isWorst && <span style={styles.badge("#ef4444")}>Slow</span>}
                    </td>
                    <td style={{ ...styles.td, color: diff < 0 ? "#10B981" : "#ef4444", fontFamily: "monospace" }}>
                      {diff !== null ? (diff >= 0 ? "+" : "") + formatTime(Math.abs(diff)) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 420, margin: "2rem auto", fontFamily: "sans-serif" },
  display: {
    fontFamily: "monospace", fontSize: 56, fontWeight: 700,
    textAlign: "center", letterSpacing: 2, padding: "24px 0",
    color: "#1e1b4b",
  },
  controls: {
    display: "flex", justifyContent: "center", gap: 12, marginBottom: 24,
  },
  btn: {
    padding: "10px 18px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
    fontWeight: 600,
  },
  lapsContainer: {
    border: "1px solid #e0e0e0", borderRadius: 10, padding: 16,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "6px 8px", textAlign: "left", fontSize: 12,
    color: "#888", borderBottom: "1px solid #eee",
  },
  td: { padding: "8px 8px", fontSize: 13, borderBottom: "1px solid #f5f5f5" },
  badge: (color) => ({
    marginLeft: 6, fontSize: 10, padding: "2px 6px",
    background: color, color: "#fff", borderRadius: 10,
  }),
};

// patch badge as method
styles.badge = (color) => ({
  marginLeft: 6, fontSize: 10, padding: "2px 6px",
  background: color, color: "#fff", borderRadius: 10,
});
