// -------- ENUM --------
export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

// -------- INTERFACES --------
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: string;
}

// -------- UTILITY TYPES --------
export type CreateProduct = Omit<Product, "id">;
export type UpdateProduct = Partial<Product>;
export type ProductSummary = Pick<Product, "id" | "name" | "price">;

// -------- TYPE GUARDS --------
export function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "price" in value &&
    "stock" in value
  );
}

export function isOrder(value: unknown): value is Order {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "items" in value &&
    "total" in value
  );
}

// -------- UTIL FUNCTION --------
function generateId(prefix: string = "ord"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// -------- CART CLASS --------
export class Cart {
  private items: Map<string, CartItem> = new Map();

  // Add item
  addItem(product: Product, quantity: number): void {
    if (!isProduct(product)) throw new Error("Invalid product");
    if (quantity <= 0) throw new Error("Quantity must be positive");
    if (quantity > product.stock) throw new Error("Insufficient stock");

    const existing = this.items.get(product.id);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) throw new Error("Stock exceeded");
      existing.quantity = newQty;
    } else {
      this.items.set(product.id, { product, quantity });
    }
  }

  // Remove item
  removeItem(productId: string): void {
    this.items.delete(productId);
  }

  // Update quantity
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) throw new Error("Quantity must be positive");

    const item = this.items.get(productId);
    if (!item) throw new Error("Item not found");

    if (quantity > item.product.stock) {
      throw new Error("Stock exceeded");
    }

    item.quantity = quantity;
  }

  // Get total
  getTotal(): number {
    let total = 0;
    this.items.forEach(({ product, quantity }) => {
      total += product.price * quantity;
    });
    return total;
  }

  // Get item count
  getItemCount(): number {
    let count = 0;
    this.items.forEach((item) => {
      count += item.quantity;
    });
    return count;
  }

  // Checkout
  checkout(address: Address): Order {
    if (this.items.size === 0) {
      throw new Error("Cart is empty");
    }

    // Validate stock again
    this.items.forEach(({ product, quantity }) => {
      if (quantity > product.stock) {
        throw new Error(`Stock not available for ${product.name}`);
      }
    });

    const order: Order = {
      id: generateId(),
      items: Array.from(this.items.values()),
      total: this.getTotal(),
      status: OrderStatus.Pending,
      shippingAddress: address,
      createdAt: new Date().toISOString(),
    };

    // Clear cart after checkout
    this.items.clear();

    return order;
  }
}

// -------- USAGE EXAMPLES --------
const cart = new Cart();

const product: Product = {
  id: "p1",
  name: "Laptop",
  price: 999,
  category: "Electronics",
  stock: 10,
};

cart.addItem(product, 2);

console.log(cart.getTotal());      // 1998
console.log(cart.getItemCount());  // 2

const order = cart.checkout({
  street: "123 Main",
  city: "NYC",
  zip: "10001",
  country: "US",
});

console.log(order.status); // Pending
console.log(order.total);  // 1998

// Type guard usage
console.log(isProduct(product)); // true
console.log(isOrder(order));     // true