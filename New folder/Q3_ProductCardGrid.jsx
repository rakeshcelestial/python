import React from "react";

const products = [
  { id: 1, name: "Wireless Headphones", price: 59.99, description: "Crisp sound with noise cancellation.", image: "https://placehold.co/200x140?text=Headphones" },
  { id: 2, name: "Mechanical Keyboard", price: 89.99, description: "Tactile switches for every keystroke.", image: "https://placehold.co/200x140?text=Keyboard" },
  { id: 3, name: "USB-C Hub", price: 34.99, description: "7-in-1 hub for all your peripherals.", image: "https://placehold.co/200x140?text=Hub" },
  { id: 4, name: "Webcam HD", price: 49.99, description: "1080p with built-in microphone.", image: "https://placehold.co/200x140?text=Webcam" },
  { id: 5, name: "Desk Lamp", price: 24.99, description: "Adjustable brightness, warm light.", image: "https://placehold.co/200x140?text=Lamp" },
  { id: 6, name: "Mouse Pad XL", price: 14.99, description: "Extra large for wide movements.", image: "https://placehold.co/200x140?text=MousePad" },
];

function ProductCard({ name, price, description, image }) {
  return (
    <div style={styles.card}>
      <img src={image} alt={name} style={styles.img} />
      <h3 style={styles.name}>{name}</h3>
      <p style={styles.price}>${price.toFixed(2)}</p>
      <p style={styles.desc}>{description}</p>
      <button style={styles.btn} onClick={() => console.log(`Added "${name}" to cart`)}>
        Add to Cart
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div style={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem", padding: "2rem", fontFamily: "sans-serif" },
  card: { border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem", background: "#fff" },
  img: { width: "100%", borderRadius: "6px", marginBottom: "0.5rem" },
  name: { fontSize: "0.95rem", fontWeight: 600, margin: "0 0 4px" },
  price: { color: "#6366f1", fontWeight: 600, margin: "0 0 6px" },
  desc: { fontSize: "0.8rem", color: "#64748b", marginBottom: "0.75rem" },
  btn: { width: "100%", padding: "0.4rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
};
