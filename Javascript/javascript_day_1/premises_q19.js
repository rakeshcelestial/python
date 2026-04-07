// =====================================
// (a) PROMISE-BASED FUNCTIONS
// =====================================

// Fetch User
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching user ${userId}...`);

    setTimeout(() => {
      if (userId > 5) {
        return reject(new Error("User not found"));
      }

      const names = ["alice", "bob", "carol", "david", "eve"];
      resolve({ id: userId, name: names[userId - 1] });
    }, 1000);
  });
}

// Fetch Orders
function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching orders for user ${userId}...`);

    setTimeout(() => {
      if (!userId) {
        return reject(new Error("Invalid user"));
      }

      resolve({ orderId: "ORD-101" });
    }, 1000);
  });
}

// Fetch Order Total
function fetchOrderTotal(orderId) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching total for order ${orderId}...`);

    setTimeout(() => {
      if (!orderId) {
        return reject(new Error("Invalid order"));
      }

      resolve({ total: 2500 });
    }, 1000);
  });
}


// =====================================
// (b) PROMISE CHAINING
// =====================================
fetchUser(1)
  .then(user => fetchOrders(user.id))
  .then(order => fetchOrderTotal(order.orderId))
  .then(result => console.log("Total:", result.total))
  .catch(err => console.error("Error:", err.message));


// =====================================
// (c) PROMISE.ALL (CONCURRENT)
// =====================================
async function runAll() {
  try {
    const users = await Promise.all([
      fetchUser(1),
      fetchUser(2),
      fetchUser(3)
    ]);

    console.log("\nAll Users:", users);
  } catch (err) {
    console.error("Error in Promise.all:", err.message);
  }
}


// =====================================
// (d) PROMISE.ALLSETTLED
// =====================================
async function runAllSettled() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchUser(2),
    fetchUser(10)
  ]);

  console.log("\nAllSettled Results:");

  results.forEach((res, index) => {
    if (res.status === "fulfilled") {
      console.log(`User ${index + 1}: fulfilled`, res.value);
    } else {
      console.log(`User ${index + 1}: rejected`, res.reason.message);
    }
  });
}


// =====================================
// (e) PROMISE.RACE (TIMEOUT)
// =====================================
async function runRace() {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 500)
  );

  try {
    const result = await Promise.race([
      fetchUser(1),
      timeout
    ]);

    console.log("\nRace Result:", result);
  } catch (err) {
    console.error("\nRace Error:", err.message);
  }
}


// =====================================
// RUN ALL
// =====================================
(async function main() {
  await runAll();
  await runAllSettled();
  await runRace();
})();