/**
 * Challenge: Create a deep clone function
 *
 * Create a function that takes an object and returns a deep clone of that object. The function should handle nested objects, arrays, and primitive types.
 *
 * Requirements:
 * - The function should accept an object of any type.
 * - It should return a new object that is a deep clone of the original object.
 * - The function should handle nested objects and arrays.
 * - It should handle primitive types (strings, numbers, booleans, null, undefined).
 * - The function should not use any external libraries
 */

//? implement the function  here
type Primitive = number | string | boolean | undefined | null;

function deepCopy<T>(variable: T): T {
  switch (typeof variable) {
    case "undefined":
    case "boolean":
    case "number":
    case "string":
      return variable;
    case "object":
      if (Array.isArray(variable)) {
        let returnArray = [];
        for (let value of variable) {
          returnArray.push(deepCopy(value));
        }
      } else {
        let returnObject = {};

        for (let property of Object.entries(variable!)) {
        }
      }
  }
  return variable;
}

function deepClone<T>(object: T): T {
  return deepCopy(object);
}

interface Test {
  name: string;
  id: number;
  price: number;
  keys: string[];
  items: object[];
  undef: undefined;
}

let testVariable: Test = {
  name: "SomeString",
  id: 1232,
  price: 123.231,
  keys: ["first", "second", "third", "fourth"],
  items: [{}, {}],
  undef: undefined,
};

let secondVariable = deepClone(testVariable);
