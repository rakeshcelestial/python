// Q20. Multi-Slice Shopping Cart (Redux Toolkit)
// Topics: Multiple Slices, Async Thunks, Selectors
// Install: npm install @reduxjs/toolkit react-redux

import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// SLICE 1 — productsSlice (async thunk to load products)
// ═══════════════════════════════════════════════════════════════

// Using JSONPlaceholder /photos as fake product data
export const loadProducts = createAsyncThunk("products/load", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=12");
    if (!res.ok) throw new Error("Failed to load products");
    const photos = await res.json();
    // Shape the raw data into product objects
    return photos.map((p) => ({
      id: p.id,
      name: `Product #${p.id}`,
      category: ["Electronics", "Clothing", "Food", "Books"][p.id % 4],
      price: parseFloat(((p.id * 7.13) % 50 + 5).toFixed(2)),
      thumbnail: p.thumbnailUrl,
    }));
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(loadProducts.fulfilled, (s, a) => { s.status = "success"; s.items = a.payload; })
      .addCase(loadProducts.rejected, (s, a) => { s.status = "error"; s.error = a.payload; });
  },
});

// ═══════════════════════════════════════════════════════════════
// SLICE 2 — cartSlice
// ═══════════════════════════════════════════════════════════════

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existing = state.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => state.filter((i) => i.id !== action.payload),
    incrementQty: (state, action) => {
      const item = state.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    decrementQty: (state, action) => {
      const item = state.find((i) => i.id === action.payload);
      if (item) item.qty = Math.max(1, item.qty - 1);
    },
    clearCart: () => [],
  },
});

const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart } = cartSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
const selectCartItemCount = (state) =>
  state.cart.reduce((sum, i) => sum + i.qty, 0);

const selectCartTotal = (state) =>
  state.cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);

const selectIsInCart = (id) => (state) =>
  state.cart.some((i) => i.id === id);

// ─── Store ────────────────────────────────────────────────────
const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
  },
});

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ─── Header ───────────────────────────────────────────────────
function Header({ onCartOpen }) {
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);

  return (
    <header style={styles.header}>
      <div style={styles.brand}>🛍 Redux Shop</div>
      <div style={styles.headerRight}>
        <span style={styles.totalText}>Total: <strong>${total}</strong></span>
        <button onClick={onCartOpen} style={styles.cartBtn}>
          🛒 Cart
          {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const inCart = useSelector(selectIsInCart(product.id));

  return (
    <div style={styles.productCard}>
      <img src={product.thumbnail} alt={product.name} style={styles.thumb} />
      <div style={styles.productBody}>
        <span style={styles.categoryTag}>{product.category}</span>
        <strong style={styles.productName}>{product.name}</strong>
        <span style={styles.productPrice}>${product.price}</span>
      </div>
      <button
        onClick={() => dispatch(addToCart(product))}
        style={inCart ? styles.inCartBtn : styles.addToCartBtn}
      >
        {inCart ? "✓ In Cart" : "+ Add to Cart"}
      </button>
    </div>
  );
}

// ─── Product List ─────────────────────────────────────────────
function ProductList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const [filter, setFilter] = useState("All");

  useEffect(() => { dispatch(loadProducts()); }, [dispatch]);

  const categories = ["All", "Electronics", "Clothing", "Food", "Books"];

  const filtered = filter === "All"
    ? items
    : items.filter((p) => p.category === filter);

  if (status === "loading") return <div style={styles.center}><p>Loading products…</p></div>;
  if (status === "error") return (
    <div style={styles.center}>
      <p style={{ color: "red" }}>Error: {error}</p>
      <button onClick={() => dispatch(loadProducts())} style={styles.retryBtn}>Retry</button>
    </div>
  );

  return (
    <div style={styles.productSection}>
      <div style={styles.filterRow}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={filter === c ? { ...styles.filterBtn, ...styles.activeFilterBtn } : styles.filterBtn}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={styles.productGrid}>
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────
function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={styles.backdrop} />

      {/* Drawer */}
      <div style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <h3 style={{ margin: 0 }}>🛒 Cart ({itemCount} items)</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div style={styles.emptyCart}>
            <div style={{ fontSize: 48 }}>🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div style={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <img src={item.thumbnail} alt={item.name} style={styles.cartThumb} />
                  <div style={styles.cartItemInfo}>
                    <strong style={{ fontSize: 13 }}>{item.name}</strong>
                    <span style={styles.cartPrice}>${item.price}</span>
                  </div>
                  <div style={styles.qtyControls}>
                    <button
                      onClick={() => dispatch(decrementQty(item.id))}
                      style={styles.qtyBtn}
                    >−</button>
                    <span style={styles.qty}>{item.qty}</span>
                    <button
                      onClick={() => dispatch(incrementQty(item.id))}
                      style={styles.qtyBtn}
                    >+</button>
                  </div>
                  <div style={styles.itemTotal}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    style={styles.removeBtn}
                  >✕</button>
                </div>
              ))}
            </div>

            <div style={styles.cartFooter}>
              <div style={styles.totalRow}>
                <span>Total</span>
                <strong style={styles.grandTotal}>${total}</strong>
              </div>
              <button
                onClick={() => { dispatch(clearCart()); onClose(); }}
                style={styles.clearCartBtn}
              >
                Clear Cart
              </button>
              <button style={styles.checkoutBtn}>
                Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Root App ──────────────────────────────────────────────────
function ShopApp() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div style={styles.app}>
      <Header onCartOpen={() => setCartOpen(true)} />
      <main style={styles.main}>
        <h2 style={styles.pageTitle}>Featured Products</h2>
        <ProductList />
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ShopApp />
    </Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = {
  app: { fontFamily: "sans-serif", minHeight: "100vh", background: "#f8f9fa" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 24px", background: "#4F46E5", color: "#fff",
    position: "sticky", top: 0, zIndex: 100,
  },
  brand: { fontWeight: 700, fontSize: 20 },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  totalText: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  cartBtn: {
    position: "relative", padding: "8px 16px", background: "rgba(255,255,255,0.2)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
  },
  badge: {
    position: "absolute", top: -6, right: -6,
    background: "#ef4444", color: "#fff", borderRadius: "50%",
    width: 20, height: 20, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 11, fontWeight: 700,
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
  pageTitle: { margin: "0 0 16px" },
  productSection: {},
  filterRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 14px", background: "#fff", border: "1px solid #ddd",
    borderRadius: 20, cursor: "pointer", fontSize: 13,
  },
  activeFilterBtn: { background: "#4F46E5", color: "#fff", border: "1px solid #4F46E5" },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  productCard: {
    background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12,
    overflow: "hidden", display: "flex", flexDirection: "column",
  },
  thumb: { width: "100%", height: 140, objectFit: "cover" },
  productBody: { padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  categoryTag: {
    fontSize: 10, padding: "2px 8px", borderRadius: 10,
    background: "#eff6ff", color: "#3b82f6", width: "fit-content",
  },
  productName: { fontSize: 13, lineHeight: 1.4 },
  productPrice: { fontSize: 16, fontWeight: 700, color: "#4F46E5" },
  addToCartBtn: {
    margin: "0 12px 12px", padding: "8px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
  },
  inCartBtn: {
    margin: "0 12px 12px", padding: "8px", background: "#d1fae5", color: "#065f46",
    border: "1px solid #6ee7b7", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
  },
  center: { display: "flex", flexDirection: "column", alignItems: "center", padding: 40 },
  retryBtn: {
    padding: "8px 16px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer",
  },
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200,
  },
  drawer: {
    position: "fixed", top: 0, right: 0, height: "100vh", width: 380,
    background: "#fff", zIndex: 300, display: "flex", flexDirection: "column",
    boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
  },
  drawerHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px", borderBottom: "1px solid #eee",
  },
  closeBtn: {
    background: "none", border: "none", fontSize: 18,
    cursor: "pointer", color: "#888",
  },
  emptyCart: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", color: "#aaa",
  },
  cartItems: { flex: 1, overflowY: "auto", padding: "12px 16px" },
  cartItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  cartThumb: { width: 48, height: 48, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  cartItemInfo: { flex: 1, display: "flex", flexDirection: "column" },
  cartPrice: { fontSize: 12, color: "#4F46E5" },
  qtyControls: { display: "flex", alignItems: "center", gap: 6 },
  qtyBtn: {
    width: 26, height: 26, background: "#f0f0f0", border: "1px solid #ddd",
    borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: 14,
  },
  qty: { minWidth: 22, textAlign: "center", fontWeight: 600, fontSize: 14 },
  itemTotal: { fontSize: 13, fontWeight: 600, minWidth: 48, textAlign: "right" },
  removeBtn: {
    background: "none", border: "none", color: "#ccc",
    cursor: "pointer", fontSize: 16,
  },
  cartFooter: {
    padding: 16, borderTop: "1px solid #eee",
    display: "flex", flexDirection: "column", gap: 10,
  },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", fontSize: 16,
  },
  grandTotal: { fontSize: 22, color: "#4F46E5" },
  clearCartBtn: {
    padding: "10px", background: "#fee2e2", color: "#ef4444",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
  },
  checkoutBtn: {
    padding: "12px", background: "#4F46E5", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 700,
  },
};
