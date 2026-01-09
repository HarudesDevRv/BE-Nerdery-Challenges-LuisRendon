import {readWishlist,
    createWishlistItem,
    removeWishlistItem,
    updateWishlistItem,
    showWishlistSummary,
    exportAsCSV} from './crud-functions.mjs';
import fs from 'fs/promises';
import readline from 'readline';
import { start } from 'repl';

//Message to show when no aditional value is passed
const welcomeMessage =`Welcome to the Wishlist Tracker
Use the following flags if you want to to interact with your wishlist on the command line:
See the items of your wishlist:\t -r
Add a new item to your wishlist: -c --name <name> --price <price> --store <store>
Update the item specified by id: -u --name <name> --price <price> --store <store> --id <id>
Remove the item specified by id: -d --id <id>
Show wishlist summary:\t\t -s
Export as CSV:\t\t\t -e
Enter the following commands non case sensitive to directly interact with your wishlist:
Create\tRead\tUpdate\tDelete\tSummary\tExport\tExit`;

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
 * Interprets what command to execute on a call with arguments
 */
function commandLineInterpreter(){
    switch(args[2]){
        case "-c": //Create a wishlist item
            if(validateArgs(["--name","--store","--price"])){
                createWishlistItem({
                    name:getArgsValue("--name"),
                    price:parseFloat(getArgsValue("--price")),
                    store:getArgsValue("--store"),
                });
            }else{
                console.log("Please enter a valid item");
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
                console.log("Please enter a valid item and id");
            }
            break;
        case "-d": //Delete a wishlist item
            if(validateArgs(["--id"])){
                removeWishlistItem(getArgsValue("--id"));
            }else{
                console.log("Please enter a valid item id");
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

/**
 * Starts a loop to read commands from the console inputs
 */
function startCommandLoop(){
    const rl = readline.createInterface({
        input:process.stdin,
        output:process.stdout,
    });
    function readCommand(){
        rl.question("Enter a command:\n",async(answer)=>{
            switch(answer.toLowerCase()){
                case "create":
                    let createItem = {
                        name:"",
                        price:0,
                        store:"",
                    };
                    rl.question("Insert the item name:\n",(answer)=>{
                        createItem.name=answer;
                    rl.question("Insert the item price:\n",(answer)=>{
                        createItem.price=parseFloat(answer);
                        if(!createItem.price){
                            rl.write("Invalid number value, operation cancelled\n");
                            readCommand();
                        }
                    rl.question("Insert the item store:\n",async (answer)=>{
                        createItem.store=answer;
                        await createWishlistItem(createItem);
                        readCommand();
                    }); }); });
                    break;
                case "read":
                    await readWishlist();
                    readCommand();
                    break;
                case "update":
                    let updateId=-1;
                    let updateItem={};
                    rl.question("Insert the item id:\n", async answer=>{
                        updateId=parseInt(answer);
                        if(!updateId){
                            rl.write("Invalid number value, operation cancelled\n");
                            readCommand();
                        }
                    rl.question("Insert the item name:\n",(answer)=>{
                        updateItem.name=answer;   
                    rl.question("Insert the item price:\n",(answer)=>{
                        updateItem.price=parseFloat(answer);
                        if(!updateItem.price){
                            rl.write("Invalid number value, operation cancelled\n");
                            readCommand();
                        }
                    rl.question("Insert the item store:\n",async (answer)=>{
                        updateItem.store=answer;
                        await updateWishlistItem(updateId,updateItem);
                        readCommand();
                    }); }); }); });
                    break;
                case "delete":
                    rl.question("Insert the item id:\n",async answer=>{
                        if(!parseInt(answer)){
                            rl.write("Invalid number value, operation cancelled\n");
                            readCommand();
                        }else{
                            await removeWishlistItem(parseInt(answer));
                            readCommand();
                        }
                    });
                    break;
                case "summary":
                    await showWishlistSummary();
                    readCommand();
                    break;
                case "export":
                    await exportAsCSV();
                    break;
                case "exit":
                    rl.write("Have a nice day!");
                    process.exit(0);
                default:
                    rl.write("Please enter a valid command\n");
                    readCommand();
                    break;
            }
        });
    }
    readCommand();
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

if(process.argv.length<3){//Show the welcome message when no aditional arg is passed
    console.log(welcomeMessage);
    startCommandLoop();
}else{
    commandLineInterpreter();
}