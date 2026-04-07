// =====================================
// ASYNC FUNCTIONS (ERROR-FIRST CALLBACK)
// =====================================

// 1. Fetch User
function fetchUser(userId, callback) {
  console.log(`Fetching user ${userId}...`);

  setTimeout(() => {
    if (userId > 5) {
      return callback(new Error("User not found"), null);
    }

    callback(null, { id: userId, name: "alice" });
  }, 1000);
}


// 2. Fetch Orders
function fetchOrders(userId, callback) {
  console.log(`Fetching orders for user ${userId}...`);

  setTimeout(() => {
    if (!userId) {
      return callback(new Error("Invalid user"), null);
    }

    callback(null, { orderId: "ORD-101" });
  }, 1000);
}


// 3. Fetch Order Total
function fetchOrderTotal(orderId, callback) {
  console.log(`Fetching total for order ${orderId}...`);

  setTimeout(() => {
    if (!orderId) {
      return callback(new Error("Invalid order"), null);
    }

    callback(null, { total: 2500 });
  }, 1000);
}


// =====================================
// ❌ CALLBACK HELL VERSION
// =====================================
function getUserOrderTotal_Hell(userId, callback) {
  fetchUser(userId, (err, user) => {
    if (err) return callback(err);

    fetchOrders(user.id, (err, order) => {
      if (err) return callback(err);

      fetchOrderTotal(order.orderId, (err, total) => {
        if (err) return callback(err);

        callback(null, {
          user: user.name,
          orderId: order.orderId,
          total: total.total
        });
      });
    });
  });
}


// =====================================
// ✅ REFACTORED VERSION (FLATTENED)
// =====================================
function getUserOrderTotal(userId, callback) {

  function handleUser(err, user) {
    if (err) return callback(err);

    fetchOrders(user.id, (err, order) => handleOrders(err, user, order));
  }

  function handleOrders(err, user, order) {
    if (err) return callback(err);

    fetchOrderTotal(order.orderId, (err, total) =>
      handleTotal(err, user, order, total)
    );
  }

  function handleTotal(err, user, order, total) {
    if (err) return callback(err);

    callback(null, {
      user: user.name,
      orderId: order.orderId,
      total: total.total
    });
  }

  fetchUser(userId, handleUser);
}


// =====================================
// TEST CASE (SUCCESS)
// =====================================
getUserOrderTotal(1, (err, result) => {
  if (err) return console.error("Error:", err.message);

  console.log("\nResult:", result);
});


// =====================================
// TEST CASE (ERROR SIMULATION)
// =====================================
getUserOrderTotal(1, (err, result) => {
  if (err) return console.error("Error:", err.message);

  console.log("\nResult:", result);

  // Run second only after first completes
  getUserOrderTotal(10, (err, result) => {
    if (err) return console.error("\nError:", err.message);

    console.log(result);
  });
});