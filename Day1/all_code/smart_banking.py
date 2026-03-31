class TransactionLogger:
    def log(self, message):
        print(f"[LOG]: {message}")


class Account:
    def __init__(self, name, balance):
        self.__name = name
        self.__balance = balance   # private variable
        self._logger = TransactionLogger()

    def deposit(self, amount):
        if amount <= 0:
            print("Invalid deposit amount")
            return
        
        self.__balance += amount
        self._logger.log(f"{self.__name} deposited {amount}")

    def withdraw(self, amount):
        if amount <= 0:
            print("Invalid withdraw amount")
            return
        
        if amount > self.__balance:
            print("Insufficient balance")
            return
        
        self.__balance -= amount
        self._logger.log(f"{self.__name} withdrew {amount}")

    def get_balance(self):
        return f"Balance: {self.__balance}"


class SavingsAccount(Account):
    pass


# Usage
acc = SavingsAccount("John", 1000)

acc.deposit(500)
acc.withdraw(200)
print(acc.get_balance())