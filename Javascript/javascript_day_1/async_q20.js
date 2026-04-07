// =====================================
// HELPER: DELAY FUNCTION
// =====================================
const delay = (ms) => new Promise(res => setTimeout(res, ms));


// =====================================
// MOCK ASYNC FUNCTIONS (PROMISES)
// =====================================
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 5) {
        return reject(new Error("User not found"));
      }

      const names = ["alice", "bob", "carol", "david", "eve"];
      resolve({ id: userId, name: names[userId - 1] });
    }, 1000);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ orderId: "ORD-101" });
    }, 1000);
  });
}

function fetchOrderTotal(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ total: 2500 });
    }, 1000);
  });
}


// =====================================
// (a) ASYNC/AWAIT VERSION (CHAIN)
// =====================================
async function getOrderTotal(userId) {
  try {
    const user = await fetchUser(userId);
    const order = await fetchOrders(user.id);
    const total = await fetchOrderTotal(order.orderId);

    console.log(`User: ${user.name} | Order: ${order.orderId} | Total: ${total.total}`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}


// =====================================
// (b) SEQUENTIAL FETCH
// =====================================
async function fetchUsersSequential(ids) {
  const start = Date.now();

  for (const id of ids) {
    const user = await fetchUser(id);
    const time = ((Date.now() - start) / 1000).toFixed(1);

    console.log(`[${time}s] Fetched user ${id}: ${user.name}`);
  }
}


// =====================================
// (c) CONCURRENT FETCH
// =====================================
async function fetchUsersConcurrent(ids) {
  const start = Date.now();

  console.log(`[0.0s] Starting all fetches...`);

  const users = await Promise.all(ids.map(id => fetchUser(id)));

  const time = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`[${time}s] All fetched: ${users.map(u => u.name).join(", ")}`);
}


// =====================================
// (d) RETRY FUNCTION
// =====================================
async function fetchWithRetry(userId, maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const user = await fetchUser(userId);
      return user; // success
    } catch (err) {
      console.log(`[retry] Attempt ${attempt} failed: ${err.message}`);

      if (attempt === maxRetries) {
        throw new Error(`All ${maxRetries} attempts failed for userId ${userId}`);
      }

      await delay(500); // wait before retry
    }
  }
}


// =====================================
// RUN ALL
// =====================================
(async function main() {

  // (a)
  await getOrderTotal(1);

  // (b) Sequential
  console.time("sequential");
  await fetchUsersSequential([1, 2, 3]);
  console.timeEnd("sequential");

  // (c) Concurrent
  console.time("\nconcurrent");
  await fetchUsersConcurrent([1, 2, 3]);
  console.timeEnd("concurrent");

  // (d) Retry
  try {
    const user = await fetchWithRetry(10, 3);
    console.log(user);
  } catch (err) {
    console.error("Error:", err.message);
  }

})();