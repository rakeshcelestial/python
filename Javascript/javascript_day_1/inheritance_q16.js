// =====================================
// BASE CLASS: Shape
// =====================================
class Shape {
  constructor(name) {
    this.name = name;
  }

  area() {
    throw new Error("Not implemented");
  }

  perimeter() {
    throw new Error("Not implemented");
  }
}


// =====================================
// CIRCLE CLASS
// =====================================
class Circle extends Shape {
  constructor(radius) {
    super("Circle");

    if (radius <= 0) {
      throw new Error("Radius must be positive");
    }

    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }

  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}


// =====================================
// RECTANGLE CLASS
// =====================================
class Rectangle extends Shape {
  constructor(width, height) {
    super("Rectangle");

    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be positive");
    }

    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }
}


// =====================================
// TRIANGLE CLASS
// =====================================
class Triangle extends Shape {
  constructor(a, b, c) {
    super("Triangle");

    if (a <= 0 || b <= 0 || c <= 0) {
      throw new Error("Sides must be positive");
    }

    this.a = a;
    this.b = b;
    this.c = c;
  }

  area() {
    // Heron's formula
    const s = (this.a + this.b + this.c) / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }

  perimeter() {
    return this.a + this.b + this.c;
  }
}


// =====================================
// REPORT FUNCTION
// =====================================
function printShapeReport(shapes) {
  console.log("Shape Report:");
  console.log("--------------------------");

  shapes.forEach(shape => {
    // Validate instance
    if (!(shape instanceof Shape)) {
      throw new Error("Invalid shape in array");
    }

    console.log(
      `${shape.name} | Area: ${shape.area().toFixed(2)} | Perimeter: ${shape.perimeter().toFixed(2)}`
    );
  });

  console.log("--------------------------");

  // Total Area using reduce
  const totalArea = shapes.reduce((sum, shape) => {
    return sum + shape.area();
  }, 0);

  console.log(`Total Area: ${totalArea.toFixed(2)}`);
}


// =====================================
// INPUT / TEST
// =====================================
const shapes = [
  new Circle(10),
  new Rectangle(5, 8),
  new Triangle(3, 4, 5),
];

printShapeReport(shapes);