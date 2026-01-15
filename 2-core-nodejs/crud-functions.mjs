import fs from "fs/promises";

const wishlistPath = "wishlist.json";

/**
 * @typedef {Object} Item
 * @property {number} id - The autoincremental identifier for the item.
 * @property {string} name - The name of the item.
 * @property {number} price - The price of the item.
 * @property {string} store - The store of the item.
 */

/**
 * @typedef {Object} Summary
 * @property {number} itemCount - The amount of items on the wishlist.
 * @property {number} total - The sum of the wishlist items values.
 * @property {Item} mostExpensiveItem - The wishlist most expensive item.
 */

/**
 * Validates the item object structure
 * @param {Item} item
 * The item to be validated
 * @returns
 * Return a boolean with the validation result
 */
function validateItem(item) {
  return (
    Object.hasOwn(item, "name") &&
    typeof item.name == "string" &&
    Object.hasOwn(item, "price") &&
    typeof item.price == "number" &&
    Object.hasOwn(item, "store") &&
    typeof item.store == "string"
  );
}

/**
 * Validates the summary object structure
 * @param {Summary} item
 * The summary to be validated
 * @returns
 * Return a boolean with the validation result
 */
function validateSummary(summary) {
  return (
    Object.hasOwn(summary, "itemCount") &&
    typeof summary.itemCount == "number" &&
    Object.hasOwn(summary, "total") &&
    typeof summary.total == "number" &&
    Object.hasOwn(summary, "mostExpensiveItem") &&
    validateItem(summary.mostExpensiveItem)
  );
}

/**
 * Process the wishlist summary data
 * @param {Summary} summary
 * An object that contains the most expensive item, the total cost and the item cost of the wishlist.
 * it must have the mostExpensiveItem, itemCount and total properties
 * @returns
 * Return a string that contains the formatted summary data
 */
const createSummary = (summary) =>
  validateSummary(summary)
    ? `This is your summary:
Most expensive item:\t${summary.mostExpensiveItem.name},` +
      ` ${summary.mostExpensiveItem.price.toFixed(2)}` +
      ` at ${summary.mostExpensiveItem.store}
Total cost:\t\t${summary.total.toFixed(2)}
Number of items:\t${summary.itemCount}
Average price:\t\t${(summary.total / summary.itemCount).toFixed(2)}`
    : "Invalid summary data";

/**
 * Creates a new item on the wishlist
 * @param {Item} item
 * The item to be created on the wishlist
 * @returns
 * Returns a success message or an error message
 */
export async function createWishlistItem(item) {
  if (!validateItem(item)) return "Please enter a valid item";

  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get and update the wishlist
  wishlist.items.push({ id: wishlist.autoincrement, ...item });
  wishlist.autoincrement++;
  let result = await fs
    .writeFile(wishlistPath, JSON.stringify(wishlist))
    .then(() => "Wishlist updated")
    .catch((err) => err.message);
  return result;
}

/**
 * Reads the wishlist and prints it on the console
 * @returns
 * Returns a success message or an error message
 */
export async function readWishlist() {
  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get and show the wishlist
  let result = "You don't have any item on your wishlist";
  if (wishlist.items.length) {
    for (let item of wishlist.items) {
      console.log(
        `${item.id}\tName: ${item.name}\tPrice: ${item.price.toFixed(2)}\tStore: ${item.store}`,
      );
    }
    result = "Items printed successfully";
  }
  return result;
}

/**
 * Removes an item from the wishlist if found
 * @param {number} id
 * The ID of the item to be removed
 * @returns
 * Returns a success message or an error message
 */
export async function removeWishlistItem(id) {
  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get the wishlist and search for the item by ID
  let items = wishlist.items;
  let itemIndex = items.findIndex((item) => item.id == id);
  let result = "Item not found";
  if (itemIndex >= 0) {
    //If found, remove the item from the wishlist
    items.splice(itemIndex, 1);
    result = await fs
      .writeFile(wishlistPath, JSON.stringify(wishlist))
      .then(() => "wishlist updated")
      .catch((err) => err.message);
  }
  return result;
}

/**
 * Updates an item from the wishlist if found with the provided data
 * @param {number} id
 * The ID of the item to be updated
 * @param {Item} updatedItem
 * The new item data
 * @returns
 * Returns a success message or an error message
 */
export async function updateWishlistItem(id, updatedItem) {
  if (!validateItem(updatedItem)) return "Please enter a valid item";

  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get the wishlist and search for the item by ID
  let items = wishlist.items;
  let itemIndex = items.findIndex((item) => item.id == id);
  let result = "Item not found";
  if (itemIndex >= 0) {
    //If found, update the item
    items[itemIndex] = { id: id, ...updatedItem };
    result = await fs
      .writeFile(wishlistPath, JSON.stringify(wishlist))
      .then(() => "Wishlist updated")
      .catch((err) => err.message);
  }
  return result;
}

/**
 * Shows the summary of the wishlist: Most expensive item, total cost, number of items and average cost
 * @returns
 * Returns the formatted summary or an error message
 */
export async function showWishlistSummary() {
  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get the wishlist and set variables to keep necessary data
  let total = 0;
  let mostExpensiveItem = {};
  let mostExpensivePrice = 0;
  let itemCount = wishlist.items.length;
  let summary = "You don't have any item on your wishlist";
  if (itemCount) {
    //If there is at least one item, calculate the total price and most expensive item
    for (let item of wishlist.items) {
      total += item.price;
      if (item.price > mostExpensivePrice) {
        mostExpensivePrice = item.price;
        mostExpensiveItem = { ...item };
      }
    }
    summary = createSummary({
      mostExpensiveItem,
      total,
      itemCount,
    });
  }
  return summary;
}

/**
 * Exports the wishlist as a CSV file and saves it locally
 * @returns
 * Returns a success message or an error message
 */
export async function exportAsCSV() {
  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get the wishlist and set the CSV header
  let csv = "Item,Name,Price,Store";
  for (let item of wishlist.items) {
    //Add each item data to the csv
    csv +=
      "\n" +
      item.id.toString() +
      "," +
      item.name +
      "," +
      item.price.toString() +
      "," +
      item.store;
  }
  let result = await fs
    .writeFile("wishlist.csv", csv)
    .then(() => "Wishlist successfully exported as CSV")
    .catch((err) => err.message);
  return result;
}

export async function getItemById(id) {
  let data = await fs.readFile(wishlistPath, { encoding: "utf8" });
  let wishlist = JSON.parse(data); //Get the wishlist and search for the item by ID
  let items = wishlist.items;
  let itemIndex = items.findIndex((item) => item.id == id);
  if (itemIndex >= 0) {
    return items[itemIndex];
  }
  return null;
}
