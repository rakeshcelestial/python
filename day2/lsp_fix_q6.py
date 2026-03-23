from abc import ABC, abstractmethod


#  Base Class
class Bird(ABC):
    @abstractmethod
    def move(self):
        pass


#  Flying Interface
class FlyingBird(Bird):
    @abstractmethod
    def fly(self):
        pass

    def move(self):
        return self.fly()


#  Swimming Interface
class SwimmingBird(Bird):
    @abstractmethod
    def swim(self):
        pass

    def move(self):
        return self.swim()


#  Concrete Classes

class Sparrow(FlyingBird):
    def fly(self):
        return "Sparrow flies"


class Eagle(FlyingBird):
    def fly(self):
        return "Eagle flies"


class Penguin(SwimmingBird):
    def swim(self):
        return "Penguin swims"


# Duck supports both flying and swimming
class Duck(FlyingBird, SwimmingBird):
    def fly(self):
        return "Duck flies"

    def swim(self):
        return "Duck swims"

    def move(self):
        return "Duck flies and swims"


# Testing
birds = [Sparrow(), Eagle(), Penguin(), Duck()]

for bird in birds:
    print(bird.move())