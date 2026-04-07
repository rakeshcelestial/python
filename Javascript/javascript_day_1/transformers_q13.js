// =====================================
// 1. pick(obj, keys)
// =====================================
const pick = (obj, keys) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};


// =====================================
// 2. omit(obj, keys)
// =====================================
const omit = (obj, keys) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!keys.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};


// =====================================
// 3. mapKeys(obj, fn)
// =====================================
const mapKeys = (obj, fn) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = fn(key, value);
    return {
      ...acc,
      [newKey]: value // computed property name
    };
  }, {});
};


// =====================================
// 4. mapValues(obj, fn)
// =====================================
const mapValues = (obj, fn) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: fn(value, key) // computed property name
    };
  }, {});
};


// =====================================
// INPUT
// =====================================
const user = {
  firstName: "Alice",
  lastName: "Smith",
  age: 25,
  password: "secret"
};


// =====================================
// TEST CASES
// =====================================
console.log("pick:");
console.log(pick(user, ["firstName", "lastName"]));

console.log("\nomit:");
console.log(omit(user, ["password"]));

console.log("\nmapKeys:");
console.log(mapKeys(user, key => key.toUpperCase()));

console.log("\nmapValues:");
console.log(mapValues({ a: 1, b: 2, c: 3 }, val => val * 10));


// =====================================
// ORIGINAL OBJECT (NOT MUTATED)
// =====================================
console.log("\nOriginal user object:");
console.log(user);