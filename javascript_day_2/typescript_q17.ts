// ---------------- (a) TYPE GUARD ----------------
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Usage examples
const val1: unknown = "hello";
if (isString(val1)) {
  console.log(val1.toUpperCase()); // OK
}

const val2: unknown = 123;
if (isString(val2)) {
  console.log(val2.toUpperCase()); // won't run
}

const val3: unknown = "TypeScript";
console.log(isString(val3)); // true


// ---------------- (b) GENERIC FIRST / LAST ----------------
export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

// Usage examples
console.log(first([1, 2, 3]));          // number | undefined
console.log(first(["a", "b"]));         // string | undefined
console.log(first([]));                 // undefined

console.log(last([1, 2, 3]));           // number | undefined
console.log(last(["x", "y"]));          // string | undefined
console.log(last([]));                  // undefined


// ---------------- (c) TYPE-SAFE EVENT HANDLER ----------------
interface EventMap {
  click: { x: number; y: number };
  keypress: { key: string };
  resize: { width: number; height: number };
}

type Handler<K extends keyof EventMap> = (data: EventMap[K]) => void;

const listeners: {
  [K in keyof EventMap]?: Handler<K>[];
} = {};

export function on<K extends keyof EventMap>(
  event: K,
  handler: Handler<K>
): void {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event]!.push(handler as any);
}

// Simulate emit (for testing)
export function emit<K extends keyof EventMap>(
  event: K,
  data: EventMap[K]
): void {
  listeners[event]?.forEach((h) => h(data));
}

// Usage examples
on("click", (data) => console.log(data.x, data.y));
on("keypress", (data) => console.log(data.key));
on("resize", (data) => console.log(data.width, data.height));

// emit events
emit("click", { x: 10, y: 20 });
emit("keypress", { key: "Enter" });
emit("resize", { width: 800, height: 600 });


// ---------------- (d) GENERIC API RESPONSE ----------------
export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export function createResponse<T>(
  data: T,
  status: number
): ApiResponse<T> {
  return {
    data,
    status,
    success: status >= 200 && status < 300,
  };
}

// Usage examples
const res1 = createResponse({ name: "Alice" }, 200);
console.log(res1.data.name); // typed

const res2 = createResponse([1, 2, 3], 200);
console.log(res2.data[0]); // number

const res3 = createResponse("Error occurred", 500);
console.log(res3.success); // false