import {
  readWishlist,
  createWishlistItem,
  removeWishlistItem,
  updateWishlistItem,
  showWishlistSummary,
  exportAsCSV,
  getItemById,
} from "./crud-functions.mjs";
import fs from "fs/promises";
import readline from "readline/promises";

//Message to show when no additional value is passed
const welcomeMessage = `Welcome to the Wishlist Tracker
Use the following flags if you want to to interact with your wishlist on the command line:
See the items of your wishlist:\t -r
Add a new item to your wishlist: -c --name <name> --price <price> --store <store>
Update the item specified by id: -u --name <name> --price <price> --store <store> --id <id>
Remove the item specified by id: -d --id <id>
Show wishlist summary:\t\t -s
Export as CSV:\t\t\t -e`;

const args = process.argv;

/**
 * Validate the arguments needed for a command to work from the process arguments
 * @param {string[]} validationArray
 * An array with the name of the arguments to be validated
 */
function validateArgs(validationArray) {
  for (let validation of validationArray) {
    let argumentIndex = args.indexOf(validation);
    //validate the argument name is specified and the next argument exists and is not another argument name
    if (
      argumentIndex < 0 ||
      argumentIndex == args.length - 1 ||
      args[argumentIndex + 1].indexOf("-") > -1
    ) {
      return false;
    }
  }
  return true;
}

const getArgsValue = (value) => args[args.indexOf(value) + 1];

/**
 * Interprets what command to execute on a call with arguments
 */
async function commandLineInterpreter() {
  let consoleMessage = "";
  switch (args[2]) {
    case "-c": //Create a wishlist item
      if (validateArgs(["--name", "--store", "--price"])) {
        consoleMessage = await createWishlistItem({
          name: getArgsValue("--name"),
          price: parseFloat(getArgsValue("--price")),
          store: getArgsValue("--store"),
        });
      } else {
        consoleMessage = "Please enter a valid item";
      }
      break;
    case "-r": //Read the wishlist items
      consoleMessage = await readWishlist();
      break;
    case "-u": //Update a wishlist item
      if (validateArgs(["--id", "--name", "--store", "--price"])) {
        consoleMessage = await updateWishlistItem(
          parseInt(getArgsValue("--id")),
          {
            name: getArgsValue("--name"),
            price: parseFloat(getArgsValue("--price")),
            store: getArgsValue("--store"),
          },
        );
      } else {
        consoleMessage = "Please enter a valid item and id";
      }
      break;
    case "-d": //Delete a wishlist item
      if (validateArgs(["--id"])) {
        consoleMessage = await removeWishlistItem(getArgsValue("--id"));
      } else {
        consoleMessage = "Please enter a valid item id";
      }
      break;
    case "-s": //Show the wishlist summary
      consoleMessage = await showWishlistSummary();
      break;
    case "-e": //Export the wishlist as CSV
      consoleMessage = await exportAsCSV();
      break;
    default:
      consoleMessage = "Please enter a valid command";
      break;
  }
  console.log(consoleMessage);
  //
}

/**
 * Creates an item by asking questions on the console, can provide an item to compare with the new one
 * @param {readline.Interface} readLine
 * The Readline Interface that will receive the data and show the messages
 * @returns {Promise<Item>}
 * Returns an Item with the entered data
 */
async function createItemOnConsole(readLine, oldItem) {
  let name = (
    await readLine.question(
      "Enter the item name:\n" + (oldItem ? `(${oldItem.name}) ` : ""),
    )
  ).trim();
  while (name === "") {
    name = (
      await readLine.question(
        "Empty strings are invalid\nPlease enter a valid item name:\n" +
          (oldItem ? `(${oldItem.name}) ` : ""),
      )
    ).trim();
  }
  let price = (
    await readLine.question(
      "Enter the item price:\n" + (oldItem ? `(${oldItem.price}) ` : ""),
    )
  ).trim();
  let floatRegEx = /^[+]?[0-9]*\.?[0-9]+$/;
  while (!floatRegEx.test(price)) {
    price = (
      await readLine.question(
        "Invalid value\nPlease enter a valid item price:\n" +
          (oldItem ? `(${oldItem.price}) ` : ""),
      )
    ).trim();
  }
  price = parseFloat(parseFloat(price).toFixed(2));
  let store = (
    await readLine.question(
      "Enter the item store:\n" + (oldItem ? `(${oldItem.store}) ` : ""),
    )
  ).trim();
  while (store === "") {
    store = (
      await readLine.question(
        "Empty strings are invalid\nPlease enter a valid store name:\n" +
          (oldItem ? `(${oldItem.store}) ` : ""),
      )
    ).trim();
  }

  return {
    name,
    price,
    store,
  };
}

/**
 * Starts a loop to read commands from the console inputs
 */
function startCommandLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  async function readCommand() {
    let answer = (
      await rl.question(
        "Enter a command:\nCreate\tRead\tUpdate\tDelete\tSummary\tExport\tExit\n",
      )
    ).trim();
    let consoleMessage = "";
    switch (answer.toLowerCase()) {
      case "create":
        let createItem = await createItemOnConsole(rl);
        consoleMessage = await createWishlistItem(createItem);
        break;
      case "read":
        consoleMessage = await readWishlist();
        break;
      case "update":
        let updateItemId = (await rl.question("Enter the item id:\n")).trim();
        if (/^\d+$/.test(updateItemId)) {
          let oldItem = await getItemById(parseInt(updateItemId));
          if (oldItem != null) {
            console.log(
              `Name: ${oldItem.name}\tPrice: ${oldItem.price.toFixed(2)}\tStore: ${oldItem.store}`,
            );
            let updateItem = await createItemOnConsole(rl, oldItem);
            consoleMessage = await updateWishlistItem(
              parseInt(updateItemId),
              updateItem,
            );
          } else {
            consoleMessage = "Item not found";
          }
        } else consoleMessage = "Invalid numeric value for id";
        break;
      case "delete":
        let deleteItemId = (await rl.question("Enter the item id:\n")).trim();
        if (/^\d+$/.test(deleteItemId)) {
          consoleMessage = await removeWishlistItem(parseInt(deleteItemId));
        } else {
          consoleMessage = "Invalid value for id, operation cancelled\n";
        }
        break;
      case "summary":
        consoleMessage = await showWishlistSummary();
        break;
      case "export":
        consoleMessage = await exportAsCSV();
        break;
      case "exit":
        rl.write("Have a nice day!");
        process.exit(0);
      default:
        consoleMessage = "Please enter a valid command\n";
        break;
    }
    console.log(consoleMessage);
    setTimeout(() => {
      readCommand();
    }, 1500);
  }
  readCommand();
}

//Make sure the wishlist exists, otherwise create it
await fs.open("wishlist.json", "a+").then((file) => {
  file.read().then((content) => {
    if (!content.buffer.find((val) => val != 0)) {
      file.write(
        JSON.stringify({
          autoincrement: 1,
          items: [],
        }),
      );
    }
    file.close();
  });
});

if (process.argv.length < 3) {
  console.log(welcomeMessage);
  startCommandLoop();
} else {
  commandLineInterpreter();
}
