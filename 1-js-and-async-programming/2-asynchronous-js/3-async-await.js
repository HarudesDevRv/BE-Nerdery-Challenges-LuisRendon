/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

const { getLikedMovies, getUsers, getDislikedMovies, getUserSubscriptionByUserId } = require("./utils/mocked-api");
/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */
const getCommonDislikedSubscription = async () => {
  //retrieve the users with more dislikes than likes similarly to the previous excercise
  let users = []
  await getUsers().then(userList => users=userList);

  let userLikedMovies = Array(users.length).fill(0);
  let userDislikedMovies = Array(users.length).fill(0);

  await getLikedMovies().then(users=>{
    for(let user of users){
      let userId = user.userId;
      for(let likedMovie of user.movies){
        userLikedMovies[userId-1]++;
      }
    }
  });

  await getDislikedMovies().then(users=>{
    for(let user of users){
      let userId = user.userId;
      for(let disLikedMovie of user.movies){
        userDislikedMovies[userId-1]++;
      }
    }
  });

  let usersWithMoreDislikedMovies=[];
 
  for(let i=0; i<users.length; i++){
    if(userDislikedMovies[i]>userLikedMovies[i])
      usersWithMoreDislikedMovies.push(users[i]);
  }
  //set a map to store how many "haters" 
  let hatersBySubscription = new Map();

  for(let user of usersWithMoreDislikedMovies){
    //await for each user subscription data
    //to keep the track for each kind of subscription without problems
    await getUserSubscriptionByUserId(user.id).then(
      subscription=>{
        let subscriptionType = subscription.subscription;
        if(hatersBySubscription.has(subscriptionType)){
          hatersBySubscription.set(subscriptionType,hatersBySubscription.get(subscriptionType)+1);
        }else{
          hatersBySubscription.set(subscriptionType,1);
        }
      }
    );
  }
  //compare the "haters" amount for each posible subscription plan 
  //and keep track of the one with the most
  let maxHaters = 0;
  let maxHatersSubscription="";

  for(let subscription of hatersBySubscription){
    if(subscription[1]>maxHaters){
      maxHaters = subscription[1];
      maxHatersSubscription = subscription[0];
    }
  }

  return maxHatersSubscription;
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
