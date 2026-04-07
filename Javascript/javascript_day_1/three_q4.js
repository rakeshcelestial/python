// ==============================
// INPUT
// ==============================
const prices = [500, 300, 200];


// ==============================
// HOISTING DEMO (DECLARATION)
// ==============================

// ✅ Works because function declaration is hoisted
console.log("Declaration (before definition):");
console.log(calculateTotal(prices, 0.18, 50, 30)); // 1085.6
console.log(calculateTotal(prices));              // 1180
console.log(calculateTotal(prices, 0.05));        // 1050


// ==============================
// FUNCTION DECLARATION
// ==============================
function calculateTotal(prices, taxRate = 0.18, ...discounts) {
  let total = prices.reduce((sum, price) => sum + price, 0);

  for (let discount of discounts) {
    total -= discount;
  }

  // Clamp to 0
  total = Math.max(0, total);

  return total * (1 + taxRate);
}


// ==============================
// FUNCTION EXPRESSION (HOISTING FAIL)
// ==============================

console.log("\nExpression (before definition):");
try {
  console.log(calculateTotalExp(prices));
} catch (error) {
  console.log("Error:", error.message); // ReferenceError
}

const calculateTotalExp = function (prices, taxRate = 0.18, ...discounts) {
  let total = prices.reduce((sum, price) => sum + price, 0);

  discounts.forEach(d => total -= d);

  total = Math.max(0, total);

  return total * (1 + taxRate);
};


// ==============================
// ARROW FUNCTION (HOISTING FAIL)
// ==============================

console.log("\nArrow (before definition):");
try {
  console.log(calculateTotalArrow(prices));
} catch (error) {
  console.log("Error:", error.message); // ReferenceError
}

const calculateTotalArrow = (prices, taxRate = 0.18, ...discounts) => {
  let total = prices.reduce((sum, price) => sum + price, 0);

  discounts.forEach(d => total -= d);

  total = Math.max(0, total);

  return total * (1 + taxRate);
};


// ==============================
// TEST AFTER DEFINITIONS
// ==============================

console.log("\nAfter Definitions:");

console.log("Expression:");
console.log(calculateTotalExp(prices, 0.18, 50, 30)); // 1085.6
console.log(calculateTotalExp(prices));              // 1180

console.log("\nArrow:");
console.log(calculateTotalArrow(prices, 0.05));      // 1050