// =====================================
// DEEP FREEZE FUNCTION
// =====================================
function deepFreeze(obj) {
  // Freeze current object
  Object.freeze(obj);

  // Recursively freeze properties
  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (
      value !== null &&
      typeof value === "object" &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}


// =====================================
// CREATE CONFIG FUNCTION
// =====================================
function createConfig({
  server: {
    port = 3000,
    host = "localhost"
  } = {},
  database: {
    url = "postgres://localhost:5432/mydb",
    poolSize = 5
  } = {},
  logging: {
    level = "info",
    file = "app.log"
  } = {}
} = {}) {

  const config = {
    server: { port, host },
    database: { url, poolSize },
    logging: { level, file }
  };

  // 🔒 Deep freeze the config
  return deepFreeze(config);
}


// =====================================
// TEST CASE 1
// =====================================
const config1 = createConfig({
  server: { port: 9090 },
  logging: { level: "debug" }
});

console.log("Config 1:");
console.log(config1);


// =====================================
// TEST CASE 2
// =====================================
const config2 = createConfig({});

console.log("\nConfig 2:");
console.log(config2);


// =====================================
// IMMUTABILITY TEST
// =====================================
try {
  config2.server.port = 9999; // Should fail
} catch (e) {
  console.log("Error:", e.message);
}

console.log("\nAfter modification attempt:");
console.log(config2.server.port); // Still 3000