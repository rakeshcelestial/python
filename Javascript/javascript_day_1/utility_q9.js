// =====================================
// 1. groupBy (using reduce)
// =====================================
const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = item[key];

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(item);
    return acc;
  }, {});
};


// =====================================
// 2. unique (using filter + indexOf)
// =====================================
const unique = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};


// =====================================
// 3. chunk (using reduce)
// =====================================
const chunk = (arr, size) => {
  return arr.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);

    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }

    acc[chunkIndex].push(item);
    return acc;
  }, []);
};


// =====================================
// 4. zip (using map)
// =====================================
const zip = (arr1, arr2) => {
  return arr1.map((item, index) => [item, arr2[index]]);
};


// =====================================
// INPUT
// =====================================
const people = [
  { name: "Alice", dept: "Engineering" },
  { name: "Bob", dept: "Marketing" },
  { name: "Carol", dept: "Engineering" },
  { name: "Dave", dept: "Marketing" },
  { name: "Eve", dept: "HR" },
];


// =====================================
// TEST CASES
// =====================================
console.log("groupBy:");
console.log(groupBy(people, "dept"));

console.log("\nunique:");
console.log(unique([1, 2, 2, 3, 4, 4, 5]));

console.log("\nchunk:");
console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3));

console.log("\nzip:");
console.log(zip(["a", "b", "c"], [1, 2, 3]));