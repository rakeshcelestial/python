class Address:
    def __init__(self, city, zip_code):
        self.city = city
        self.zip_code = zip_code


class PaymentInfo:
    def __init__(self, method, amount):
        self.method = method
        self.amount = amount


class OrderItem:
    def __init__(self, name, qty, price):
        self.name = name
        self.qty = qty
        self.price = price

    def total_price(self):
        return self.qty * self.price


class Order:
    def __init__(self, address, payment, items):
        self.address = address            # composition
        self.payment = payment            # composition
        self.items = items                # list of OrderItem

    def order_summary(self):
        # Shipping details
        print(f"Shipping: {self.address.city} - {self.address.zip_code}")

        # Items details
        item_details = []
        total = 0

        for item in self.items:
            item_total = item.total_price()
            total += item_total
            item_details.append(f"{item.name} x{item.qty} = {item_total}")

        print("Items: " + ", ".join(item_details))

        # Total and payment
        print(f"Total: {total}")
        print(f"Payment: {self.payment.method}")


# Input
addr = Address("Bangalore", "560001")
pay = PaymentInfo("UPI", 1500)
items = [
    OrderItem("Book", 2, 500),
    OrderItem("Pen", 5, 100)
]

order = Order(addr, pay, items)
order.order_summary()