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

type ElementType<T> = T extends (infer U)[] ? U : any;

function deepClone<T extends Primitive | object>(clonedObject: T): T {
  switch (typeof clonedObject) {
    case "undefined":
    case "boolean":
    case "number":
    case "string":
      //If its a primitive just return it
      return clonedObject;
    case "object":
      if (Array.isArray(clonedObject)) {
        //If its an array, create a new empty array of inferred type
        let returnArray: ElementType<T>[] = [];
        for (let value of clonedObject) {
          //Recursively fill the array to handle nested objects
          returnArray.push(deepClone(value));
        }
        return returnArray as T;
      } else {
        if (clonedObject) {
          //If its an object, duplicate the original one first
          let returnObject: T = { ...clonedObject };
          let keys = Object.keys(clonedObject);
          (Object.keys(clonedObject) as (keyof T)[]).forEach(
            (propertyKey, i) => {
              //Recursively assign the properties to handle nested objects
              let propertyValue = (clonedObject as { [key: string]: any })[
                keys[i]
              ];
              Object.assign(returnObject, {
                [propertyKey]: deepClone(propertyValue),
              });
            },
          );
          return returnObject;
        }
      }
  }
  return clonedObject; //If it didn't satisfy the switch case it must be null
}

interface Item {
  name: string;
  ids: number[];
}

interface Test {
  name: string;
  id: number;
  price: number;
  keys: string[];
  items: Item[];
  mostExpensiveItem: Item;
  undef: undefined;
  nullable: string | null;
}

let testVariable: Test = {
  name: "SomeString",
  id: 1232,
  price: 123.231,
  keys: ["first", "second", "third", "fourth"],
  items: [
    { name: "test item 1", ids: [1, 2, 3] },
    { name: "test item 2", ids: [4, 5, 6] },
  ],
  mostExpensiveItem: { name: "test item 4", ids: [10, 20, 30] },
  nullable: null,
  undef: undefined,
};

let secondVariable = deepClone(testVariable);

secondVariable.id = 1211;

secondVariable.name = "Second";

secondVariable.price = 542.23;

secondVariable.keys.push("fifth");

secondVariable.keys[3] = "No longer fourth";

secondVariable.items.push({
  name: "test item 3",
  ids: [7, 8, 9],
});

secondVariable.items[0].name = "no longer item 1";
secondVariable.items[0].ids[0] = 0;
secondVariable.items[0].ids.push(13);

secondVariable.items[1].ids = [25, 36, 49];

secondVariable.mostExpensiveItem.name = "no longer item 4";
secondVariable.mostExpensiveItem.ids = [10, 11, 12];

console.log("First object");
console.log(testVariable);

console.log("Second object");
console.log(secondVariable);

console.log("First item");
console.log(testVariable.items[0].ids);
console.log(secondVariable.items[0].ids);
console.log(testVariable.items[1].ids);
console.log(secondVariable.items[1].ids);
