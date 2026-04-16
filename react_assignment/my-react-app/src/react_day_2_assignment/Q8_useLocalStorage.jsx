// Q8. useLocalStorage Custom Hook
// Topics: Custom Hooks, localStorage, State Persistence

import { useState } from "react";

// ─── Custom Hook ──────────────────────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}"`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`useLocalStorage: error removing key "${key}"`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

// ─── Notes App ────────────────────────────────────────────────
export default function NotesApp() {
  const [notes, setNotes, clearNotes] = useLocalStorage("react-notes", []);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const addNote = () => {
    if (!input.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now(), text: input.trim(), createdAt: new Date().toLocaleString() },
    ]);
    setInput("");
  };

  const deleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const startEdit = (note) => { setEditId(note.id); setEditText(note.text); };

  const saveEdit = () => {
    setNotes((prev) =>
      prev.map((n) => (n.id === editId ? { ...n, text: editText } : n))
    );
    setEditId(null);
    setEditText("");
  };

  return (
    <div style={styles.container}>
      <h2>📝 Notes App</h2>
      <p style={styles.hint}>Notes persist across page refreshes via localStorage.</p>

      {/* Add Note */}
      <div style={styles.addRow}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a new note…"
          rows={3}
          style={styles.textarea}
          onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) addNote(); }}
        />
        <button onClick={addNote} style={styles.addBtn} disabled={!input.trim()}>
          Add Note
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <p style={styles.empty}>No notes yet. Add one above!</p>
      ) : (
        <div style={styles.grid}>
          {notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              {editId === note.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    style={styles.textarea}
                    autoFocus
                  />
                  <div style={styles.actionRow}>
                    <button onClick={saveEdit} style={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditId(null)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={styles.noteText}>{note.text}</p>
                  <span style={styles.date}>{note.createdAt}</span>
                  <div style={styles.actionRow}>
                    <button onClick={() => startEdit(note)} style={styles.editBtn}>✏️ Edit</button>
                    <button onClick={() => deleteNote(note.id)} style={styles.deleteBtn}>🗑 Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <button onClick={clearNotes} style={styles.clearBtn}>
          Clear All Notes
        </button>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  hint: { color: "#888", fontSize: 13, marginTop: -8 },
  addRow: { display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-start" },
  textarea: {
    flex: 1, padding: "8px 10px", fontSize: 14,
    border: "1px solid #ccc", borderRadius: 8, resize: "vertical",
    fontFamily: "inherit",
  },
  addBtn: {
    padding: "10px 18px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
    whiteSpace: "nowrap",
  },
  empty: { textAlign: "center", color: "#aaa", fontSize: 14, marginTop: 40 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 },
  noteCard: {
    background: "#fffde7", border: "1px solid #f0e68c",
    borderRadius: 10, padding: 14, display: "flex",
    flexDirection: "column", gap: 8,
  },
  noteText: { margin: 0, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" },
  date: { fontSize: 11, color: "#999" },
  actionRow: { display: "flex", gap: 8 },
  editBtn: { padding: "4px 10px", background: "#f0f0f0", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 },
  deleteBtn: { padding: "4px 10px", background: "#fee2e2", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 },
  saveBtn: { padding: "4px 10px", background: "#d1fae5", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 },
  cancelBtn: { padding: "4px 10px", background: "#f0f0f0", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 },
  clearBtn: {
    marginTop: 20, padding: "8px 16px", background: "#ef4444",
    color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
  },
};
