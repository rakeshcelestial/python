// =====================================
// DEEP MERGE FUNCTION (RECURSIVE)
// =====================================
function deepMerge(target, source) {
  // Helper: check if value is a plain object (not array, not null)
  const isObject = (val) =>
    val !== null && typeof val === "object" && !Array.isArray(val);

  // Create a new object (avoid mutation)
  const result = { ...target };

  for (let key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // Case 1: Both are arrays → concatenate
    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      result[key] = [...targetValue, ...sourceValue];
    }

    // Case 2: Both are objects → recurse
    else if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    }

    // Case 3: Otherwise → override (includes primitives & null)
    else {
      result[key] = sourceValue;
    }
  }

  return result;
}


// =====================================
// INPUT
// =====================================
const defaults = {
  server: { port: 3000, host: "localhost" },
  database: { url: "localhost:5432", pool: { min: 2, max: 5 } },
  features: ["auth"],
};

const overrides = {
  server: { port: 8080 },
  database: { pool: { max: 20 } },
  features: ["logging"],
  debug: true,
};


// =====================================
// OUTPUT
// =====================================
const merged = deepMerge(defaults, overrides);

console.log(merged);


// =====================================
// VERIFY ORIGINALS ARE NOT MUTATED
// =====================================
console.log("\nOriginal defaults:", defaults);
console.log("Original overrides:", overrides);