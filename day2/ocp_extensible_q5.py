from abc import ABC, abstractmethod


#  Abstract Base Class
class Discount(ABC):

    @abstractmethod
    def apply(self, amount):
        pass


#  Concrete Discount Classes

class NoDiscount(Discount):
    def apply(self, amount):
        return amount


class PercentageDiscount(Discount):
    def apply(self, amount):
        return max(amount - (amount * 0.10), 0)


class FlatDiscount(Discount):
    def apply(self, amount):
        return max(amount - 200, 0)


class BuyOneGetOneFree(Discount):
    def apply(self, amount):
        return max(amount * 0.5, 0)


#  Calculation Function (Closed for Modification)
def calculate_total(amount, discount: Discount):
    return discount.apply(amount)


# Testing
print(calculate_total(1000, PercentageDiscount()))
print(calculate_total(1000, FlatDiscount()))
print(calculate_total(1000, BuyOneGetOneFree()))