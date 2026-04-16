import React, { useState, useCallback, memo } from "react";

const TodoItem = memo(({ id, text, onDelete }) => {
  console.log(`Rendering TodoItem: ${text}`);
  return (
    <li style={styles.item}>
      <span>{text}</span>
      <button style={styles.del} onClick={() => onDelete(id)}>✕</button>
    </li>
  );
});

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Buy groceries" },
    { id: 2, text: "Write code" },
    { id: 3, text: "Read a book" },
  ]);
  const [input, setInput] = useState("");
  const [counter, setCounter] = useState(0);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: input.trim() }]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Todo List <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>(useCallback + React.memo)</span></h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <input style={styles.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="New task..." />
        <button style={styles.btn} onClick={addTodo}>Add</button>
      </div>

      <button style={{ ...styles.btn, background: "#94a3b8", marginBottom: "1rem" }} onClick={() => setCounter((c) => c + 1)}>
        Unrelated counter: {counter}
      </button>

      <ul style={styles.list}>
        {todos.map((t) => <TodoItem key={t.id} {...t} onDelete={deleteTodo} />)}
      </ul>
    </div>
  );
}

const styles = {
  input: { flex: 1, padding: "0.4rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px" },
  btn: { padding: "0.4rem 0.9rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  list: { listStyle: "none", padding: 0 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #f1f5f9" },
  del: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.9rem" },
};
