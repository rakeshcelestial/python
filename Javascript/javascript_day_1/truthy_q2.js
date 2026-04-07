const data = [0, "hello", null, 42, "", undefined, false, "world", NaN];

// (a) Remove all falsy values
const cleanData = (arr) => arr.filter(Boolean);

// (b) Replace only null and undefined
const replaceNulls = (arr, replacement) => 
  arr.map(item => item == null ? replacement : item);

// Test
console.log(cleanData(data));
console.log(replaceNulls(data, "N/A"));