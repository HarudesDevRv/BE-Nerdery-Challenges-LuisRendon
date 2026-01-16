import { deepClone } from "./1-deep-clone";

interface Item {
  name: string;
  ids: number[];
}

//Mocked data for testing
interface TestingType {
  name: string;
  id: number;
  price: number;
  keys: string[];
  items: Item[];
  mostExpensiveItem: Item;
  undef: undefined;
  nullable: string | null;
}

let testVariable: TestingType = {
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

console.log("Testing nested items modifications");
console.log(testVariable.items[0].ids);
console.log(secondVariable.items[0].ids);
console.log(testVariable.items[1].ids);
console.log(secondVariable.items[1].ids);
