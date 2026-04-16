import React from "react";

const students = [
  { rollNo: 1, name: "Alice", marks: 88 },
  { rollNo: 2, name: "Bob", marks: 32 },
  { rollNo: 3, name: "Carol", marks: 75 },
  { rollNo: 4, name: "David", marks: 91 },
  { rollNo: 5, name: "Eva", marks: 28 },
  { rollNo: 6, name: "Frank", marks: 60 },
];

function getStyle(marks) {
  if (marks > 75) return { background: "#dcfce7", color: "#166534" };
  if (marks < 35) return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f8fafc", color: "#1e293b" };
}

export default function App() {
  return (
    <div style={{ maxWidth: "500px", margin: "3rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Student Results</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            {["Roll No", "Name", "Marks"].map((h) => (
              <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.85rem", color: "#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.rollNo} style={{ ...getStyle(s.marks), borderBottom: "1px solid #e2e8f0" }}>
              <td style={styles.cell}>{s.rollNo}</td>
              <td style={styles.cell}>{s.name}</td>
              <td style={{ ...styles.cell, fontWeight: 600 }}>{s.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = { cell: { padding: "0.6rem 1rem", fontSize: "0.95rem" } };
