// Q13. CRUD App with Axios
// Topics: Axios, CRUD Operations, Loading & Error States
// Install: npm install axios

import axios from "axios";
import { useState, useEffect } from "react";

// ─── Axios Instance ───────────────────────────────────────────
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000,
});

// ─── Toast Component ──────────────────────────────────────────
function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div style={{ ...styles.toast, background: type === "error" ? "#ef4444" : "#10B981" }}>
      {message}
      <button onClick={onClose} style={styles.toastClose}>✕</button>
    </div>
  );
}

// ─── User Form ────────────────────────────────────────────────
function UserForm({ editUser, onSave, onCancel, submitting }) {
  const [form, setForm] = useState(
    editUser || { name: "", email: "", phone: "", website: "" }
  );

  useEffect(() => {
    setForm(editUser || { name: "", email: "", phone: "", website: "" });
  }, [editUser]);

  const field = (key, label, type = "text") => (
    <div style={styles.fieldGroup} key={key}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={form[key] || ""}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={label}
        style={styles.input}
        disabled={submitting}
      />
    </div>
  );

  return (
    <div style={styles.formCard}>
      <h3 style={{ margin: "0 0 16px" }}>
        {editUser ? "✏️ Edit User" : "➕ Add New User"}
      </h3>
      <div style={styles.twoCol}>
        {field("name", "Full Name")}
        {field("email", "Email", "email")}
      </div>
      <div style={styles.twoCol}>
        {field("phone", "Phone")}
        {field("website", "Website")}
      </div>
      <div style={styles.formActions}>
        <button onClick={onCancel} disabled={submitting} style={styles.cancelBtn}>
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={submitting || !form.name.trim()}
          style={submitting ? styles.disabledBtn : styles.saveBtn}
        >
          {submitting ? "Saving…" : editUser ? "Update User" : "Create User"}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────
export default function UsersApp() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  // READ
  useEffect(() => {
    api.get("/users")
      .then(({ data }) => setUsers(data))
      .catch(() => showToast("Failed to load users", "error"))
      .finally(() => setLoading(false));
  }, []);

  // CREATE
  const createUser = async (form) => {
    try {
      setSubmitting(true);
      const { data } = await api.post("/users", form);
      setUsers((prev) => [{ ...form, id: data.id || Date.now() }, ...prev]);
      showToast("User created successfully!");
      setShowForm(false);
    } catch {
      showToast("Failed to create user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // UPDATE
  const updateUser = async (form) => {
    try {
      setSubmitting(true);
      await api.put(`/users/${form.id}`, form);
      setUsers((prev) => prev.map((u) => (u.id === form.id ? { ...u, ...form } : u)));
      showToast("User updated successfully!");
      setEditUser(null);
      setShowForm(false);
    } catch {
      showToast("Failed to update user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted.");
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const handleSave = (form) => (editUser ? updateUser(form) : createUser(form));

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setShowForm(false); setEditUser(null); };

  if (loading) return <div style={styles.center}><p>Loading users…</p></div>;

  return (
    <div style={styles.container}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "" })} />

      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>👥 Users CRUD</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addBtn}>
            + Add User
          </button>
        )}
      </div>

      {showForm && (
        <UserForm
          editUser={editUser}
          onSave={handleSave}
          onCancel={handleCancel}
          submitting={submitting}
        />
      )}

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span style={{ flex: 2 }}>Name</span>
          <span style={{ flex: 3 }}>Email</span>
          <span style={{ flex: 2 }}>Phone</span>
          <span style={{ flex: 1 }}>Actions</span>
        </div>
        {users.map((user) => (
          <div key={user.id} style={styles.tableRow}>
            <span style={{ flex: 2, fontWeight: 500 }}>{user.name}</span>
            <span style={{ flex: 3, color: "#555", fontSize: 13 }}>{user.email}</span>
            <span style={{ flex: 2, color: "#888", fontSize: 13 }}>{user.phone}</span>
            <div style={{ flex: 1, display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(user)} style={styles.editBtn}>Edit</button>
              <button onClick={() => deleteUser(user.id)} style={styles.deleteBtn}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 860, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 16px" },
  center: { display: "flex", justifyContent: "center", marginTop: 60 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  addBtn: {
    padding: "10px 18px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
  },
  formCard: { background: "#f8f9ff", border: "1px solid #dde", borderRadius: 12, padding: 20, marginBottom: 20 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  fieldGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: 12, color: "#666", marginBottom: 4 },
  input: { padding: "8px 10px", fontSize: 14, borderRadius: 6, border: "1px solid #ccc" },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 },
  saveBtn: { padding: "10px 20px", background: "#10B981", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  cancelBtn: { padding: "10px 20px", background: "#f0f0f0", color: "#333", border: "none", borderRadius: 8, cursor: "pointer" },
  disabledBtn: { padding: "10px 20px", background: "#aaa", color: "#fff", border: "none", borderRadius: 8, cursor: "not-allowed" },
  table: { border: "1px solid #e0e0e0", borderRadius: 10, overflow: "hidden" },
  tableHeader: {
    display: "flex", padding: "10px 16px", background: "#f5f5f5",
    fontSize: 13, fontWeight: 600, color: "#666",
  },
  tableRow: {
    display: "flex", padding: "12px 16px", borderTop: "1px solid #eee",
    alignItems: "center", fontSize: 14,
  },
  editBtn: { padding: "4px 10px", background: "#e0e7ff", color: "#4F46E5", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 },
  deleteBtn: { padding: "4px 10px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12 },
  toast: {
    position: "fixed", top: 20, right: 20, color: "#fff",
    padding: "12px 16px", borderRadius: 8, display: "flex",
    alignItems: "center", gap: 10, zIndex: 1000, fontSize: 14,
  },
  toastClose: { background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 },
};
