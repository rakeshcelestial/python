function deepEqual(a, b) {
  // Step 1: Strict equality for primitives (also handles same reference)
  if (a === b) return true;

  // Step 2: Handle null explicitly
  if (a == null || b == null) return false;

  // Step 3: Check if both are objects (arrays are also objects)
  if (typeof a !== "object" || typeof b !== "object") return false;

  // Step 4: Handle arrays vs objects mismatch
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Step 5: Compare keys length
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  // Step 6: Recursive comparison
  for (let key of keysA) {
    if (!keysB.includes(key)) return false;

    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true

console.log(deepEqual([1, [2, 3]], [1, [2, 3]])); // true

console.log(deepEqual({ a: 1 }, { a: "1" })); // false

console.log(deepEqual(null, null)); // true

console.log(deepEqual(null, {})); // false