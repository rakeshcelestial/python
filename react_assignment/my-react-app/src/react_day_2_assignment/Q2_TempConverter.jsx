// Q2. Temperature Converter — Lifting State Up
// Topics: Lifting State Up, Sibling Sync

import { useState } from "react";

function CelsiusInput({ celsius, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label>Celsius (°C)</label>
      <input
        type="number"
        value={celsius}
        onChange={(e) => onChange(Number(e.target.value))}
        style={styles.input}
      />
    </div>
  );
}

function FahrenheitInput({ celsius, onChange }) {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return (
    <div style={styles.inputGroup}>
      <label>Fahrenheit (°F)</label>
      <input
        type="number"
        value={Math.round(fahrenheit * 100) / 100}
        onChange={(e) => onChange(((Number(e.target.value) - 32) * 5) / 9)}
        style={styles.input}
      />
    </div>
  );
}

function WaterStatus({ celsius }) {
  let status, color;
  if (celsius <= 0) { status = "freeze ❄️"; color = "#3B82F6"; }
  else if (celsius >= 100) { status = "boil 🔥"; color = "#EF4444"; }
  else { status = "be liquid 💧"; color = "#10B981"; }

  return (
    <div style={{ ...styles.statusBox, borderColor: color, color }}>
      Water would: <strong>{status}</strong>
    </div>
  );
}

export default function TempConverter() {
  const [celsius, setCelsius] = useState(25);

  return (
    <div style={styles.container}>
      <h2>Temperature Converter</h2>
      <div style={styles.row}>
        <CelsiusInput celsius={celsius} onChange={setCelsius} />
        <span style={styles.arrow}>⇄</span>
        <FahrenheitInput celsius={celsius} onChange={setCelsius} />
      </div>
      <WaterStatus celsius={celsius} />
    </div>
  );
}

const styles = {
  container: { maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" },
  row: { display: "flex", alignItems: "center", gap: 16, marginBottom: 20 },
  inputGroup: { display: "flex", flexDirection: "column", flex: 1 },
  input: { padding: "8px 10px", fontSize: 16, borderRadius: 6, border: "1px solid #ccc" },
  arrow: { fontSize: 24, color: "#888", marginTop: 18 },
  statusBox: {
    padding: "12px 16px", borderRadius: 8, border: "2px solid",
    fontSize: 16, textAlign: "center",
  },
};
