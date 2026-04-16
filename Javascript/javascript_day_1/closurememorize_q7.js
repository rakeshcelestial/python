// =====================================
// MEMOIZE FUNCTION (CLOSURE + CACHING)
// =====================================
function memoize(fn) {
  //  Private cache (closure)
  const cache = {};

  return function (arg) {
    const key = String(arg); // cache key (stringified)

    if (key in cache) {
      console.log(`Cache hit: ${arg}`);
      return cache[key];
    }

    console.log(`Computing: ${arg}`);

    const result = fn(arg);
    cache[key] = result;

    return result;
  };
}


// =====================================
// SLOW FUNCTION (SIMULATION)
// =====================================
const slowSquare = (n) => {
  // simulate heavy computation
  for (let i = 0; i < 1e8; i++) {}

  return n * n;
};


// =====================================
// MEMOIZED VERSION
// =====================================
const fastSquare = memoize(slowSquare);


// =====================================
// TEST CASES
// =====================================
console.log(fastSquare(5));   // Computing
console.log(fastSquare(5));   // Cache hit
console.log(fastSquare(10));  // Computing


// =====================================
// EXTRA TEST (PROVES CACHE WORKS)
// =====================================
console.log(fastSquare(10));  // Cache hit again


// =====================================
// INTERNAL CACHE IS PRIVATE
// =====================================
//  Not accessible
console.log(fastSquare.cache); // undefined