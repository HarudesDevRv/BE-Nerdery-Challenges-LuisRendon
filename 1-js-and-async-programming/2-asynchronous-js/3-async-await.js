/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

const {
  getLikedMovies,
  getUsers,
  getDislikedMovies,
  getUserSubscriptionByUserId,
} = require("./utils/mocked-api");
/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */
const getCommonDislikedSubscription = async () => {
  //Retrieve the users with more dislikes than likes similarly to the previous exercise
  let [users, userLikedMovies, userDislikedMovies] = await Promise.all([
    getUsers(),
    getLikedMovies(),
    getDislikedMovies(),
  ]);

  let usersWithMoreDislikedMovies = [];

  for (let i = 0; i < users.length; i++) {
    if (userDislikedMovies[i].movies.length > userLikedMovies[i].movies.length)
      usersWithMoreDislikedMovies.push(users[i]);
  }

  let hatersBySubscription = [];
  for (let user of usersWithMoreDislikedMovies) {
    //Await for each user subscription data and count the haters by subscription
    let userSubscription = await getUserSubscriptionByUserId(user.id);
    userSubscription = userSubscription.subscription;
    let subscriptionIndex = hatersBySubscription.findIndex(
      (subscription) => subscription.name == userSubscription,
    );
    if (subscriptionIndex >= 0) {
      hatersBySubscription[subscriptionIndex].count += 1;
    } else {
      hatersBySubscription.push({
        name: userSubscription,
        count: 1,
      });
    }
  }
  //Get the highest "haters" amount and return its subscription
  let result = { name: "none", count: 0 };
  for (let subscription of hatersBySubscription) {
    if (subscription.count > result.count) {
      result = subscription;
    }
  }

  return result.name;
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
