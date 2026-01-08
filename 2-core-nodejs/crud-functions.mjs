import fs from 'fs/promises';

const wishlistPath = 'wishlist.json';

function validateItem(item){
    return Object.hasOwn(item,"name") && Object.hasOwn(item,"price") && Object.hasOwn(item,"store");
}

export function createWishlistItem(item){
    if(!validateItem(item)){
        console.log("Please enter a valid item");
        return;
    }
    fs.readFile(wishlistPath, { encoding: 'utf8' }).then(data=>{
        let wishlist = JSON.parse(data);
        wishlist.items.push({id:wishlist.autoincrement,...item,});
        wishlist.autoincrement++;
        fs.writeFile(wishlistPath,JSON.stringify(wishlist)).then(()=>{
            console.log("wishlist updated");
            console.log(wishlist);
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    });
    console.log("finished creating");
}

export function readWishlist(){
    fs.readFile(wishlistPath, { encoding: 'utf8' }).then(data=>{
        let wishlist = JSON.parse(data);
        for(let item of wishlist.items){
            console.log(`${item.id}\tName: ${item.name}\tPrice: ${item.price}\tStore: ${item.store}`);
        }
    }).catch(err=>{
        console.log(err);
    });
}

export function removeWishlistItem(id){
    fs.readFile(wishlistPath,{encoding:'utf8'}).then(data=>{
        let wishlist = JSON.parse(data);
        let items = wishlist.items;
        let itemIndex = items.findIndex(item=>item.id==id);
        if(itemIndex>=0){
            console.log("item found at index",itemIndex);
            items.splice(itemIndex,1);
            fs.writeFile(wishlistPath,JSON.stringify(wishlist)).then(()=>{
                console.log("wishlist updated");
                console.log(wishlist);
            }).catch(err=>{
                console.log(err);
            });
        }
        else{
            console.log("Item not found");
        }
        console.log(wishlist);
    }).catch(err=>{

    });
    //console.log(wishlist);
}

export function updateWishlistItem(id, updatedItem){
    if(!validateItem(updatedItem)){
        console.log("Please enter a valid item");
        return;
    }
    fs.readFile(wishlistPath,{encoding:'utf8'}).then(data=>{
        let wishlist = JSON.parse(data);
        let items = wishlist.items;
        let itemIndex = items.findIndex(item=>item.id==id);
        console.log(itemIndex);
        if(itemIndex>=0){
            console.log("item found at index",itemIndex);
            items[itemIndex]={id:id,...updatedItem};
            fs.writeFile(wishlistPath,JSON.stringify(wishlist)).then(()=>{
                console.log("wishlist updated");
                console.log(wishlist);
            }).catch(err=>{
                console.log(err);
            });
        }
        else{
            console.log("Item not found");
        }
        console.log(wishlist);
    }).catch(err=>{

    });
    //console.log(wishlist);
}