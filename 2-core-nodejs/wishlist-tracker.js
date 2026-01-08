import {readWishlist,
    createWishlistItem,
    removeWishlistItem,
    updateWishlistItem,
    showWishlistSummary,
    exportAsCSV} from './crud-functions.mjs';
import fs from 'fs/promises';

//Message to show when no aditional value is passed
const welcomeMessage =`Welcome to the Wishlist Tracker
Use the following commands to interact with your wishlist:
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
function validateArgs(validationArray){
    for(let validation of validationArray){
        let argumentIndex = args.indexOf(validation)
        //validate the argument name is specified and the next argument exists and is not another argument name
        if(argumentIndex <0 || argumentIndex == args.length-1 || args[argumentIndex+1].indexOf("-")>-1){
            return false;
        }
    }
    return true;
}

const getArgsValue = value => args[args.indexOf(value)+1];

/**
 * Interprets what command to execute
 */
function commandLineInterpreter(){
    if(process.argv.length<3){//Show the welcome message when no aditional arg is passed
        console.log(welcomeMessage);
    }
    else{
        switch(args[2]){
            case "-c": //Create a wishlist item
                if(validateArgs(["--name","--store","--price"])){
                    createWishlistItem({
                        name:getArgsValue("--name"),
                        price:parseFloat(getArgsValue("--price")),
                        store:getArgsValue("--store"),
                    });
                }else{
                    console.log("Please enter a valid command");
                }
                break;
            case "-r": //Read the wishlist items
                readWishlist();
                break;
            case "-u": //Update a wishlist item
                if(validateArgs(["--id","--name","--store","--price"])){
                    updateWishlistItem(parseInt(getArgsValue("--id")),{
                        name:getArgsValue("--name"),
                        price:parseFloat(getArgsValue("--price")),
                        store:getArgsValue("--store"),
                    });
                }else{
                    console.log("Please enter a valid command");
                }
                break;
            case "-d": //Delete a wishlist item
                if(validateArgs(["--id"])){
                    removeWishlistItem(getArgsValue("--id"));
                }else{
                    console.log("Please enter a valid command");
                }
                break;
            case "-s": //Show the wishlist summary
                showWishlistSummary();
                break;
            case "-e": //Export the wishlist as CSV
                exportAsCSV();
                break;
            default:
                console.log("Please enter a valid command");
                break;
        }
        //
    }
}


//Make sure the wishlist exists, otherwise create it
fs.open('wishlist.json',"a+").then(file=>{
    file.read().then(content=>{
        if(!content.buffer.find(val=>val!=0)){
            file.write(JSON.stringify({
                autoincrement:1,
                items:[],
            }));
        }
        file.close();
    })
});


commandLineInterpreter();