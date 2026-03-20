class Bird:
    def eat(self):
        print("Bird is eating")


class FlyingBird(Bird):
    def fly(self):
        print("Flying...")


class SwimmingBird(Bird):
    def swim(self):
        print("Swimming...")


class Sparrow(FlyingBird):
    def fly(self):
        print("Sparrow flies")


class Penguin(SwimmingBird):
    def swim(self):
        print("Penguin swims")


# 🔹 Usage
sparrow = Sparrow()
penguin = Penguin()

sparrow.fly()
penguin.swim()