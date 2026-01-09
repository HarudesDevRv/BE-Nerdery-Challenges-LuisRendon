import fs from 'fs/promises';

const wishlistPath = 'wishlist.json';

/**
 * @typedef {Object} Item
 * @property {number} id - The autoincremental identifier for the item.
 * @property {string} name - The name of the item.
 * @property {number} price - The price of the item.
 * @property {string} store - The store of the item.
 */

/**
 * Validates the item object structure
 * @param {Item} item 
 * The item to be validated
 */
function validateItem(item){
    return Object.hasOwn(item,"name") && typeof(item.name) == "string" &&
     Object.hasOwn(item,"price") && typeof(item.price) == "number" && 
     Object.hasOwn(item,"store") && typeof(item.store) == "string";
}

/**
 * Creates a new item on the wishlist
 * @param {Item} item 
 * The item to be created on the wishlist
 */
export async function createWishlistItem(item){
    if(!validateItem(item)){//Show an alert when the item data is not valid
        console.log("Please enter a valid item");
        return;
    }
    await fs.readFile(wishlistPath, { encoding: 'utf8' }).then(async data=>{
        let wishlist = JSON.parse(data);//Get and update the wishlist
        wishlist.items.push({id:wishlist.autoincrement,...item,});
        wishlist.autoincrement++;
        await fs.writeFile(wishlistPath,JSON.stringify(wishlist)).then(()=>{//Save the updated wishlist
            console.log("Wishlist updated");
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    });
}

/**
 * Reads the wishlist and prints it on the console
 */
export async function readWishlist(){
    await fs.readFile(wishlistPath, { encoding: 'utf8' }).then(data=>{
        let wishlist = JSON.parse(data);//Get and show the wishlist
        if(wishlist.items.length){
            for(let item of wishlist.items){
                console.log(`${item.id}\tName: ${item.name}\tPrice: ${item.price.toFixed(2)}\tStore: ${item.store}`);
            }
        }else{
            console.log("You have no items on your wishlist");
        }
    }).catch(err=>{
        console.log(err);
    });
}

/**
 * Removes an item from the wishlist if found
 * @param {number} id 
 * The ID of the item to be removed
 */
export async function removeWishlistItem(id){
    await fs.readFile(wishlistPath,{encoding:'utf8'}).then(async data=>{
        let wishlist = JSON.parse(data);//Get the wishlist and search for the item by ID
        let items = wishlist.items;
        let itemIndex = items.findIndex(item=>item.id==id);
        if(itemIndex>=0){//If found, remove the item from the wishlist
            items.splice(itemIndex,1);
            await fs.writeFile(wishlistPath,JSON.stringify(wishlist)).then(()=>{//Save the updatet wishlist
                console.log("wishlist updated");
            }).catch(err=>{
                console.log(err);
            });
        }
        else{
            console.log("Item not found");
        }
    }).catch(err=>{
        console.log(err);
    });
}

/**
 * Updates an item from the wishlist if found with the provided data
 * @param {number} id 
 * The ID of the item to be updated
 * @param {Item} updatedItem 
 * The new item data
 * @returns 
 */
export async function updateWishlistItem(id, updatedItem){
    if(!validateItem(updatedItem)){//Show an alert when the item data is not valid
        console.log("Please enter a valid item");
        return;
    }
    await fs.readFile(wishlistPath,{encoding:'utf8'}).then(async data=>{
        let wishlist = JSON.parse(data);//Get the wishlist and search for the item by ID
        let items = wishlist.items;
        let itemIndex = items.findIndex(item=>item.id==id);
        if(itemIndex>=0){//If found, update the item
            items[itemIndex]={id:id,...updatedItem};
            await fs.writeFile(wishlistPath,JSON.stringify(wishlist)).then(()=>{//Save the updated wishlist
                console.log("Wishlist updated");
            }).catch(err=>{
                console.log(err);
            });
        }
        else{
            console.log("Item not found");
        }
    }).catch(err=>{
        console.log(err);
    });
}

/**
 * Shows the summary of the wishlist: Most expensive item, total cost, number of items and average cost
 */
export async function showWishlistSummary(){
    await fs.readFile(wishlistPath, { encoding: 'utf8' }).then(data=>{
        let wishlist = JSON.parse(data);//Get the wishlist and set variables to keep necessary data
        let total = 0;
        let mostExpensiveItem = {};
        let mostExpensivePrice= 0;
        let itemCount = wishlist.items.length;
        if(itemCount){//If there is at least one item, calculate the total price and most expensive item
            for(let item of wishlist.items){
                total += item.price;
                if(item.price > mostExpensivePrice){
                    mostExpensivePrice = item.price;
                    mostExpensiveItem = {...item};
                }
            }
            console.log(//Calculate an show the summary
`This is your summary:
Most expensive item:\t${mostExpensiveItem.name}, ${mostExpensiveItem.price.toFixed(2)} at ${mostExpensiveItem.store}
Total cost:\t\t${total.toFixed(2)}
Number of items:\t${itemCount}
Average price:\t\t${(total/itemCount).toFixed(2)}`);
        }else{
            console.log("You have no items on your wishlist");
        }
    }).catch(err=>{
        console.log(err);
    });
}

/**
 * Exports the wishlist as a CSV file and saves it locally
 */
export async function exportAsCSV(){
    await fs.readFile(wishlistPath, { encoding: 'utf8' }).then(async data=>{
        let wishlist = JSON.parse(data);//Get the wishlist and set the CSV header
        let csv = "Item,Name,Price,Store";
        for(let item of wishlist.items){//Add each item data to the csv
            csv+='\n' + item.id.toString() + "," + item.name + "," + item.price.toString() + ","+item.store;
        }
        await fs.writeFile('wishlist.csv',csv).then(()=>{//Locally save the CSV on the code folder
            console.log("Wishlist successfully exported as CSV");
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    });
}