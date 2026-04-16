function describeType(value) {
    // Check for null
    if (value === null) {
        var a = 5;
        var b = 10;
        console.log(b)
    }

    // Check for NaN
    if (Number.isNaN(value)) {
        b = 12;
        console.log(b);
        return "NaN";
    }

    // Check for array
    if (Array.isArray(value)) {
        return "array";
    }

    // Get type using typeof
    return  typeof value;

    return type;
}


console.log(describeType(42));          // "number"
console.log(describeType("hello"));     // "string"
console.log(describeType(null));        // "null"
console.log(describeType([1, 2]));      // "array"
console.log(describeType(NaN));         // "NaN"
console.log(describeType({ a: 1 }));    // "object"
console.log(describeType(undefined));   // "undefined"
console.log(describeType(() => {}));    // "function"