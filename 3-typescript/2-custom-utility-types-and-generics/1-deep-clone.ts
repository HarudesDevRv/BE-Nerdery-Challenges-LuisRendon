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

export function deepClone<T extends Primitive | object>(clonedObject: T): T {
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
