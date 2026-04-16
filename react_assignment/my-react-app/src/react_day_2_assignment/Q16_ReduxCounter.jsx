// Q16. Redux Counter
// Topics: Redux Toolkit, createSlice, useSelector, useDispatch
// Install: npm install @reduxjs/toolkit react-redux

import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

// ─── Slice ────────────────────────────────────────────────────
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0, history: [] },
  reducers: {
    increment: (state) => {
      state.history.push(state.value);
      state.value += 1;
    },
    decrement: (state) => {
      state.history.push(state.value);
      state.value -= 1;
    },
    reset: (state) => {
      state.history.push(state.value);
      state.value = 0;
    },
    incrementByAmount: (state, action) => {
      state.history.push(state.value);
      state.value += action.payload;
    },
  },
});

const { increment, decrement, reset, incrementByAmount } = counterSlice.actions;

// ─── Store ────────────────────────────────────────────────────
const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

// ─── Component A: Display (instance 1) ───────────────────────
function CounterDisplayA() {
  const value = useSelector((state) => state.counter.value);
  return (
    <div style={styles.displayBox}>
      <p style={styles.displayLabel}>Component A reads count:</p>
      <div style={styles.displayValue}>{value}</div>
    </div>
  );
}

// ─── Component B: Display (instance 2 — proves shared state) ─
function CounterDisplayB() {
  const value = useSelector((state) => state.counter.value);
  return (
    <div style={{ ...styles.displayBox, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
      <p style={styles.displayLabel}>Component B also reads count:</p>
      <div style={{ ...styles.displayValue, color: "#15803d" }}>{value}</div>
    </div>
  );
}

// ─── Controls ─────────────────────────────────────────────────
function CounterControls() {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.counter.history);

  return (
    <div>
      <div style={styles.controls}>
        <button onClick={() => dispatch(decrement())} style={styles.btn}>− Dec</button>
        <button onClick={() => dispatch(reset())} style={{ ...styles.btn, background: "#6b7280" }}>
          ↺ Reset
        </button>
        <button onClick={() => dispatch(increment())} style={{ ...styles.btn, background: "#10B981" }}>
          + Inc
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          style={{ ...styles.btn, background: "#f59e0b" }}
        >
          +5
        </button>
      </div>

      {history.length > 0 && (
        <div style={styles.history}>
          <span style={styles.histLabel}>History: </span>
          {[...history].reverse().slice(0, 10).map((v, i) => (
            <span key={i} style={styles.histBadge}>{v}</span>
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
      <div style={styles.container}>
        <h2>Redux Counter</h2>
        <p style={styles.hint}>
          Both display components read from the <em>same store</em> — updating one updates both.
        </p>

        <div style={styles.displays}>
          <CounterDisplayA />
          <CounterDisplayB />
        </div>

        <CounterControls />
      </div>
    </Provider>
  );
}

const styles = {
  container: { maxWidth: 520, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  hint: { color: "#666", fontSize: 13 },
  displays: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  displayBox: {
    background: "#eff6ff", border: "2px solid #bfdbfe",
    borderRadius: 12, padding: 20, textAlign: "center",
  },
  displayLabel: { color: "#3b82f6", fontSize: 12, margin: "0 0 8px" },
  displayValue: { fontSize: 56, fontWeight: 700, color: "#1d4ed8" },
  controls: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 },
  btn: {
    padding: "10px 16px", background: "#ef4444", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
  },
  history: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  histLabel: { fontSize: 13, color: "#888" },
  histBadge: {
    padding: "3px 10px", background: "#f3f4f6", border: "1px solid #e0e0e0",
    borderRadius: 20, fontSize: 12, color: "#555",
  },
};
