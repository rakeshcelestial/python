import React, { useState, useEffect, useRef } from "react";

function pad(n) { return String(n).padStart(2, "0"); }

export default function App() {
  const [time, setTime] = useState(new Date());
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTime(new Date()), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const { hours, minutes, seconds } = {
    hours: pad(time.getHours()),
    minutes: pad(time.getMinutes()),
    seconds: pad(time.getSeconds()),
  };

  return (
    <div style={styles.container}>
      <p style={styles.clock}>{hours}:{minutes}:{seconds}</p>
      <button style={styles.btn} onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : "Resume"}
      </button>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "4rem 2rem", fontFamily: "monospace" },
  clock: { fontSize: "4rem", fontWeight: 700, letterSpacing: "0.1em", color: "#1e293b", margin: "0 0 1.5rem" },
  btn: { padding: "0.5rem 1.5rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem" },
};
