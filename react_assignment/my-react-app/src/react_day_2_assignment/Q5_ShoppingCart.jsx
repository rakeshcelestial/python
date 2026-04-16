// Q5. Shopping Cart with useReducer + Context
// Topics: useReducer, Context API, State Sharing

import { createContext, useContext, useReducer } from "react";

// ─── Cart Reducer ────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.id === action.item.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "INC":
      return state.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "DEC":
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
  return (
    <CartContext.Provider value={{ cart, dispatch, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Sample Products ──────────────────────────────────────────
const products = [
  { id: 1, name: "Apple", price: 1.5, emoji: "🍎" },
  { id: 2, name: "Bread", price: 2.0, emoji: "🍞" },
  { id: 3, name: "Milk", price: 1.2, emoji: "🥛" },
  { id: 4, name: "Eggs (dozen)", price: 3.5, emoji: "🥚" },
  { id: 5, name: "Butter", price: 2.8, emoji: "🧈" },
];

// ─── Header Component ─────────────────────────────────────────
export function Header() {
  const { itemCount } = useContext(CartContext);
  return (
    <header style={styles.header}>
      <h2 style={{ margin: 0 }}>🛒 My Shop</h2>
      <span style={styles.badge}>{itemCount} items</span>
    </header>
  );
}

// ─── Product List ─────────────────────────────────────────────
export function ProductList() {
  const { dispatch } = useContext(CartContext);
  return (
    <div>
      <h3>Products</h3>
      <div style={styles.productGrid}>
        {products.map((p) => (
          <div key={p.id} style={styles.productCard}>
            <div style={styles.emoji}>{p.emoji}</div>
            <strong>{p.name}</strong>
            <span style={styles.price}>${p.price.toFixed(2)}</span>
            <button
              onClick={() => dispatch({ type: "ADD", item: p })}
              style={styles.addBtn}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cart Component ───────────────────────────────────────────
export function Cart() {
  const { cart, dispatch, total } = useContext(CartContext);
  if (cart.length === 0) return <p style={{ color: "#888" }}>Cart is empty.</p>;
  return (
    <div>
      <h3>Cart</h3>
      {cart.map((item) => (
        <div key={item.id} style={styles.cartRow}>
          <span>{item.emoji} {item.name}</span>
          <div style={styles.qtyControls}>
            <button onClick={() => dispatch({ type: "DEC", id: item.id })} style={styles.qtyBtn}>−</button>
            <span style={styles.qty}>{item.qty}</span>
            <button onClick={() => dispatch({ type: "INC", id: item.id })} style={styles.qtyBtn}>+</button>
          </div>
          <span>${(item.price * item.qty).toFixed(2)}</span>
          <button onClick={() => dispatch({ type: "REMOVE", id: item.id })} style={styles.removeBtn}>✕</button>
        </div>
      ))}
      <div style={styles.totalRow}>
        <strong>Total: ${total.toFixed(2)}</strong>
        <button onClick={() => dispatch({ type: "CLEAR" })} style={styles.clearBtn}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <CartProvider>
      <div style={styles.container}>
        <Header />
        <div style={styles.body}>
          <ProductList />
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
}

const styles = {
  container: { maxWidth: 800, margin: "0 auto", fontFamily: "sans-serif" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 20px", background: "#4F46E5", color: "#fff", borderRadius: 8,
  },
  badge: {
    background: "#fff", color: "#4F46E5", padding: "4px 12px",
    borderRadius: 20, fontWeight: 600, fontSize: 14,
  },
  body: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "20px 0" },
  productGrid: { display: "flex", flexDirection: "column", gap: 10 },
  productCard: {
    display: "flex", alignItems: "center", gap: 12, padding: 10,
    border: "1px solid #eee", borderRadius: 8,
  },
  emoji: { fontSize: 24 },
  price: { color: "#4F46E5", marginLeft: "auto" },
  addBtn: {
    padding: "6px 12px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13,
  },
  cartRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "8px 0", borderBottom: "1px solid #eee",
  },
  qtyControls: { display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" },
  qtyBtn: {
    width: 28, height: 28, background: "#f0f0f0", border: "1px solid #ccc",
    borderRadius: 4, cursor: "pointer", fontWeight: 700,
  },
  qty: { minWidth: 20, textAlign: "center", fontWeight: 600 },
  removeBtn: {
    background: "none", border: "none", color: "#ef4444",
    cursor: "pointer", fontSize: 16, fontWeight: 700,
  },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginTop: 12, paddingTop: 8,
    borderTop: "2px solid #eee",
  },
  clearBtn: {
    padding: "6px 14px", background: "#ef4444", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer",
  },
};
