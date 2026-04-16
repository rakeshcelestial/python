// =====================================
// VEHICLE CONSTRUCTOR FUNCTION
// =====================================
function Vehicle(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}


// =====================================
// METHOD ON VEHICLE PROTOTYPE
// =====================================
Vehicle.prototype.drive = function () {
  console.log(`${this.make} ${this.model} (${this.year}) is driving`);
};


// =====================================
// CAR CONSTRUCTOR FUNCTION
// =====================================
function Car(make, model, year) {
  // Inherit properties from Vehicle
  Vehicle.call(this, make, model, year);
}


// =====================================
// PROTOTYPE INHERITANCE
// =====================================

// Link Car.prototype → Vehicle.prototype
Car.prototype = Object.create(Vehicle.prototype);

// Restore constructor reference
Car.prototype.constructor = Car;


// =====================================
// CAR-SPECIFIC METHOD
// =====================================
Car.prototype.honk = function () {
  console.log(`${this.make} ${this.model} (${this.year}) honks: Beep beep!`);
};


// =====================================
// TESTING
// =====================================
const car = new Car("Toyota", "Camry", 2024);

car.drive();
car.honk();

console.log(car instanceof Car);
console.log(car instanceof Vehicle);

console.log(
  Object.getPrototypeOf(Object.getPrototypeOf(car)) === Vehicle.prototype
);


// =====================================
// PROTOTYPE CHAIN VISUAL CHECK
// =====================================
// car
//   ↓
// Car.prototype
//   ↓
// Vehicle.prototype
//   ↓
// Object.prototype