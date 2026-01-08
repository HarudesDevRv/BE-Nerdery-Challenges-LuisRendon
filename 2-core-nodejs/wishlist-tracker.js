import { exportAsCSV } from './crud-functions.mjs';
import {readWishlist,
    createWishlistItem,
    removeWishlistItem,
    updateWishlistItem,
    showWishlistSummary} from './crud-functions.mjs';
import fs from 'fs/promises';

const welcomeMessage =`Welcome to the Wishlist Tracker
Use the following commands to interact with your wishlist:
See the items of your wishlist: -r
Add a new item to your wishlist: -c --name <name> --price <price> --store <store>
Update the item specified by id: -u --id <id> --name <name> --price <price> --store <store>
Remove the item specified by id: -d --id <id>
Show wishlist summary: -s
Export as CSV: -e`;

const args = process.argv;

function validateArgs(validationArray){
    for(let validation of validationArray){
        let argumentIndex = args.indexOf(validation)
        if(argumentIndex <0 || argumentIndex == args.length-1 || args[argumentIndex+1].indexOf("-")>-1){
            return false;
        }
    }
    return true;
}

const getArgsValue = value => args[args.indexOf(value)+1];


function commandLineInterpreter(){
    if(process.argv.length==2){
        console.log(welcomeMessage);
    }
    else{
        //console.log(process.argv);
        switch(args[2]){
            case "-c":
                if(validateArgs(["--name","--store","--price"])){
                    createWishlistItem({
                        name:getArgsValue("--name"),
                        price:parseInt(getArgsValue("--price")),
                        store:getArgsValue("--store"),
                    });
                }else{
                    console.log("Please enter a valid command");
                }
                break;
            case "-r":
                readWishlist();
                break;
            case "-u":
                if(validateArgs(["--id","--name","--store","--price"])){
                    updateWishlistItem(parseInt(getArgsValue("--id")),{
                        name:getArgsValue("--name"),
                        price:parseInt(getArgsValue("--price")),
                        store:getArgsValue("--store"),
                    });
                }else{
                    console.log("Please enter a valid command");
                }
                break;
            case "-d":
                if(validateArgs(["--id"])){
                    removeWishlistItem(getArgsValue("--id"));
                }else{
                    console.log("Please enter a valid command");
                }
                break;
            case "-s":
                showWishlistSummary();
                break;
            case "-e":
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