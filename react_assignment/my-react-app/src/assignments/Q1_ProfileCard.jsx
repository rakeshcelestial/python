import React from "react";

function ProfileCard({ name, title, bio, avatarUrl }) {
  return (
    <div style={styles.card}>
      <img src={avatarUrl} alt={name} style={styles.avatar} />
      <h2 style={styles.name}>{name}</h2>
      <p style={styles.title}>{title}</p>
      <p style={styles.bio}>{bio}</p>
    </div>
  );
}

const profiles = [
  {
    name: "Alice Johnson",
    title: "Frontend Developer",
    bio: "Passionate about building accessible and beautiful UIs.",
    avatarUrl: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Bob Smith",
    title: "Backend Engineer",
    bio: "Loves distributed systems and clean APIs.",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Carol White",
    title: "UX Designer",
    bio: "Turning complex problems into simple, elegant solutions.",
    avatarUrl: "https://i.pravatar.cc/100?img=3",
  },
];

export default function App() {
  return (
    <div style={styles.container}>
      {profiles.map((p, i) => (
        <ProfileCard key={i} {...p} />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.5rem",
    width: "220px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "0.75rem",
  },
  name: { fontSize: "1.1rem", fontWeight: "600", margin: "0 0 4px" },
  title: { fontSize: "0.85rem", color: "#6366f1", margin: "0 0 8px" },
  bio: { fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 },
};
