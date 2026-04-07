// ---------------- (a) GENERIC STACK ----------------
export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop() as T;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Usage examples
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.pop());   // 3
console.log(stack.peek());  // 2
console.log(stack.size());  // 2


// ---------------- (b) GENERIC DICTIONARY ----------------
export class Dictionary<K extends string | number, V> {
  private data: Record<K, V> = {} as Record<K, V>;

  set(key: K, value: V): void {
    this.data[key] = value;
  }

  get(key: K): V | undefined {
    return this.data[key];
  }

  has(key: K): boolean {
    return key in this.data;
  }

  delete(key: K): void {
    delete this.data[key];
  }

  keys(): K[] {
    return Object.keys(this.data) as K[];
  }

  values(): V[] {
    return Object.values(this.data);
  }

  entries(): [K, V][] {
    return Object.entries(this.data) as [K, V][];
  }

  forEach(callback: (key: K, value: V) => void): void {
    this.entries().forEach(([k, v]) => callback(k, v));
  }
}

// Usage examples
const dict = new Dictionary<string, number>();
dict.set("age", 25);
dict.set("score", 90);

console.log(dict.get("age"));     // 25
console.log(dict.keys());         // ["age", "score"]
dict.forEach((k, v) => console.log(k, v));


// ---------------- (c) RESULT TYPE ----------------
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Factory functions
export function ok<T, E = never>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function err<T = never, E = unknown>(error: E): Result<T, E> {
  return { ok: false, error };
}

// Type guard
export function isOk<T, E>(res: Result<T, E>): res is { ok: true; value: T } {
  return res.ok;
}

// Unwrap
export function unwrap<T, E>(res: Result<T, E>): T {
  if (res.ok) return res.value;
  throw new Error(String(res.error));
}

// map
export function map<T, E, U>(
  res: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return res.ok ? ok(fn(res.value)) : res;
}

// flatMap
export function flatMap<T, E, U>(
  res: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return res.ok ? fn(res.value) : res;
}

// Usage examples
const r1: Result<number, string> = ok(42);
console.log(unwrap(r1)); // 42

const r2 = map(r1, (x) => x * 2);
console.log(unwrap(r2)); // 84

const r3 = flatMap(r1, (x) => ok(x + 10));
console.log(unwrap(r3)); // 52

const rErr = err("not found");
// unwrap(rErr); // throws error