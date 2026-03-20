from abc import ABC, abstractmethod


# 🔹 Logger (SRP)
class Logger:
    def log(self, message):
        print(f"[LOG]: {message}")


# 🔹 Payment Interface (ISP + DIP)
class Payment(ABC):
    @abstractmethod
    def pay(self, amount):
        pass


# 🔹 Concrete Payment Methods (OCP + LSP)
class UPI(Payment):
    def pay(self, amount):
        print(f"Payment Successful via UPI")


class Card(Payment):
    def pay(self, amount):
        print(f"Payment Successful via Card")


# 🔹 Discount Interface (ISP + DIP)
class Discount(ABC):
    @abstractmethod
    def apply(self, amount):
        pass


# 🔹 Concrete Discounts (OCP + LSP)
class FestivalDiscount(Discount):
    def apply(self, amount):
        return amount * 0.9   # 10% discount


class PremiumDiscount(Discount):
    def apply(self, amount):
        return amount * 0.8   # 20% discount


# 🔹 Checkout (depends on abstraction → DIP)
class Checkout:
    def __init__(self, payment: Payment, discount: Discount):
        self.payment = payment
        self.discount = discount
        self.logger = Logger()

    def process(self, amount):
        final_amount = self.discount.apply(amount)
        
        print(f"Final Amount: {int(final_amount)}")
        
        self.payment.pay(final_amount)
        
        self.logger.log("Checkout completed")


# 🔹 Usage
checkout = Checkout(payment=UPI(), discount=FestivalDiscount())
checkout.process(1000)