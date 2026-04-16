// =====================================
// CREATE WALLET (CLOSURE WITH PRIVACY)
// =====================================
function createWallet(ownerName, initialBalance) {
  //  Private variables
  let balance = initialBalance;
  let history = [];

  // Validate initial balance
  if (initialBalance < 0) {
    throw new Error("Initial balance cannot be negative");
  }

  return {
    deposit(amount) {
      if (amount <= 0) {
        throw new Error("Deposit amount must be greater than 0");
      }

      balance += amount;

      history.push({
        type: "deposit",
        amount,
        balance
      });
    },

    withdraw(amount) {
      if (amount <= 0) {
        throw new Error("Withdrawal amount must be greater than 0");
      }

      if (amount > balance) {
        throw new Error(
          `Insufficient balance. Current balance: ${balance}`
        );
      }

      balance -= amount;

      history.push({
        type: "withdraw",
        amount,
        balance
      });
    },

    getBalance() {
      return balance;
    },

    getOwner() {
      return ownerName;
    },

    getHistory() {
      // Return a copy (protect internal data)
      return [...history];
    }
  };
}


// =====================================
// TESTING THE WALLET
// =====================================

const wallet = createWallet("Alice", 1000);

// Perform operations
wallet.deposit(500);
wallet.withdraw(200);

// Outputs
console.log("Balance:", wallet.getBalance());

console.log("History:", wallet.getHistory());

console.log("Owner:", wallet.getOwner());

// Error test
try {
  wallet.withdraw(2000);
} catch (e) {
  console.log("Error:", e.message);
}


// =====================================
// PRIVACY CHECK (SHOULD BE UNDEFINED)
// =====================================

console.log("Direct balance access:", wallet.balance); // undefined
console.log("Direct history access:", wallet.history); // undefined