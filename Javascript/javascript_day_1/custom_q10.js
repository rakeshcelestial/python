// =====================================
// CUSTOM ARRAY METHODS IMPLEMENTATION
// =====================================

// ==============================
// 1. myMap
// ==============================
Array.prototype.myMap = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    // Skip empty slots (like native map)
    if (!(i in this)) continue;

    result[i] = callback(this[i], i, this);
  }

  return result;
};


// ==============================
// 2. myFilter
// ==============================
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue;

    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};


// ==============================
// 3. myReduce
// ==============================
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  // Handle case when initialValue is NOT provided
  if (accumulator === undefined) {
    // Find first valid element
    while (startIndex < this.length && !(startIndex in this)) {
      startIndex++;
    }

    if (startIndex >= this.length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = this[startIndex];
    startIndex++;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (!(i in this)) continue;

    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};


// =====================================
// INPUT
// =====================================
const nums = [1, 2, 3, 4, 5];


// =====================================
// TEST CASES
// =====================================
console.log("myMap:");
console.log(nums.myMap(n => n * 2)); 
// [2, 4, 6, 8, 10]

console.log("\nmyFilter:");
console.log(nums.myFilter(n => n % 2 === 0)); 
// [2, 4]

console.log("\nmyReduce:");
console.log(nums.myReduce((acc, n) => acc + n, 0)); 
// 15