// Q17. Redux Todo List
// Topics: Redux Toolkit, Multiple Reducers, Component Connection
// Install: npm install @reduxjs/toolkit react-redux

import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import { useState } from "react";

// ─── Slice ────────────────────────────────────────────────────
let nextId = 1;

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: nextId++,
        text: action.payload,
        completed: false,
        createdAt: new Date().toLocaleTimeString(),
      });
    },
    removeTodo: (state, action) => state.filter((t) => t.id !== action.payload),
    toggleTodo: (state, action) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    clearAll: () => [],
  },
});

const { addTodo, removeTodo, toggleTodo, clearAll } = todoSlice.actions;

// ─── Store ────────────────────────────────────────────────────
const store = configureStore({ reducer: { todos: todoSlice.reducer } });

// ─── Component 1: AddTodo ─────────────────────────────────────
function AddTodo() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(addTodo(text.trim()));
    setText("");
  };

  return (
    <div style={styles.addSection}>
      <h3 style={styles.sectionTitle}>➕ Add Todo</h3>
      <div style={styles.addRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <button onClick={handleAdd} disabled={!text.trim()} style={styles.addBtn}>
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Component 2: TodoList ────────────────────────────────────
function TodoList() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all"); // all | active | completed

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div style={styles.listSection}>
      <div style={styles.listHeader}>
        <h3 style={styles.sectionTitle}>📋 Todo List</h3>
        <div style={styles.filterRow}>
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={filter === f ? { ...styles.filterBtn, ...styles.activeFilter } : styles.filterBtn}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={styles.empty}>
          {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
        </p>
      ) : (
        <ul style={styles.list}>
          {filtered.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              <button
                onClick={() => dispatch(toggleTodo(todo.id))}
                style={todo.completed ? styles.checkDone : styles.checkBtn}
              >
                {todo.completed ? "✓" : "○"}
              </button>
              <div style={styles.todoContent}>
                <span style={todo.completed ? styles.doneText : styles.todoText}>
                  {todo.text}
                </span>
                <span style={styles.time}>{todo.createdAt}</span>
              </div>
              <button
                onClick={() => dispatch(removeTodo(todo.id))}
                style={styles.removeBtn}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Component 3: TodoStats ───────────────────────────────────
function TodoStats() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={styles.statsSection}>
      <h3 style={styles.sectionTitle}>📊 Stats</h3>
      <div style={styles.statsGrid}>
        {[
          ["Total", total, "#4F46E5"],
          ["Completed", completed, "#10B981"],
          ["Pending", pending, "#f59e0b"],
        ].map(([label, value, color]) => (
          <div key={label} style={styles.statCard}>
            <div style={{ ...styles.statValue, color }}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${percent}%` }} />
          </div>
          <p style={styles.progressLabel}>{percent}% complete</p>
          <button onClick={() => dispatch(clearAll())} style={styles.clearBtn}>
            🗑 Clear All
          </button>
        </>
      )}
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <div style={styles.container}>
        <h2>Redux Todo App</h2>
        <p style={styles.hint}>Three independent components — all connected to the same Redux store.</p>
        <div style={styles.layout}>
          <div style={styles.leftCol}>
            <AddTodo />
            <TodoStats />
          </div>
          <div style={styles.rightCol}>
            <TodoList />
          </div>
        </div>
      </div>
    </Provider>
  );
}

const styles = {
  container: { maxWidth: 820, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  hint: { color: "#666", fontSize: 13 },
  layout: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20 },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: {},
  addSection: { border: "1px solid #e0e0e0", borderRadius: 10, padding: 16 },
  listSection: { border: "1px solid #e0e0e0", borderRadius: 10, padding: 16 },
  statsSection: { border: "1px solid #e0e0e0", borderRadius: 10, padding: 16 },
  sectionTitle: { margin: "0 0 12px", fontSize: 15 },
  addRow: { display: "flex", gap: 8 },
  input: {
    flex: 1, padding: "8px 12px", fontSize: 14,
    border: "1px solid #ccc", borderRadius: 8,
  },
  addBtn: {
    padding: "8px 16px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer",
  },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  filterRow: { display: "flex", gap: 4 },
  filterBtn: {
    padding: "4px 10px", background: "#f0f0f0", border: "1px solid #ddd",
    borderRadius: 6, cursor: "pointer", fontSize: 12,
  },
  activeFilter: { background: "#4F46E5", color: "#fff", border: "1px solid #4F46E5" },
  empty: { color: "#aaa", textAlign: "center", padding: "20px 0", fontSize: 13 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  todoItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  checkBtn: {
    width: 28, height: 28, borderRadius: "50%", border: "2px solid #ccc",
    background: "none", cursor: "pointer", fontSize: 14, color: "#ccc",
  },
  checkDone: {
    width: 28, height: 28, borderRadius: "50%", border: "2px solid #10B981",
    background: "#10B981", cursor: "pointer", fontSize: 14, color: "#fff",
  },
  todoContent: { flex: 1, display: "flex", flexDirection: "column" },
  todoText: { fontSize: 14 },
  doneText: { fontSize: 14, textDecoration: "line-through", color: "#aaa" },
  time: { fontSize: 11, color: "#bbb", marginTop: 2 },
  removeBtn: {
    background: "none", border: "none", color: "#ccc",
    cursor: "pointer", fontSize: 16, padding: "0 4px",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 },
  statCard: { background: "#f9fafb", borderRadius: 8, padding: "12px 8px", textAlign: "center" },
  statValue: { fontSize: 28, fontWeight: 700 },
  statLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  progressBar: { height: 8, background: "#e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 4 },
  progressFill: { height: "100%", background: "#10B981", borderRadius: 4, transition: "width 0.3s" },
  progressLabel: { fontSize: 12, color: "#888", textAlign: "right", margin: "0 0 10px" },
  clearBtn: {
    width: "100%", padding: "8px", background: "#fee2e2", color: "#ef4444",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13,
  },
};
