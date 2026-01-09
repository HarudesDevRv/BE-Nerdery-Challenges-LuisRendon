/*
  Challenge 2: Users Who Dislike More Movies Than They Like

  Get a list of users who have rated more movies negatively than positively.

  Use the methods in utils/mocked-api to retrieve user and rating data.
  Check how many movies each user liked and disliked, then return only those with more dislikes.

  Requirements:
  - Use only Promise static methods (e.g., Promise.all, Promise.then, etc.) to handle the results
  - Only print the user information in the output—no extra text or formatting

 */

const { getLikedMovies, getUsers, getDislikedMovies } = require("./utils/mocked-api");

/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {number} age - The age of the user.
 */

/**
 * Logs and returns the users who dislike more movies than they like.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of users who dislike more movies than they like.
 */
const getUsersWithMoreDislikedMoviesThanLikedMovies = () => {
  let users = []
  let userLikedMovies = [];
  let userDislikedMovies = [];
  //retrieve de users list
  let usersList = getUsers().then(userList => users=userList);
  //get the likeds movies for each user and store them in the arrays
  let likedMovies = getLikedMovies().then(users=>userLikedMovies = users.map(user=>user.movies.length));

  //get the dislikeds movies for each user and store them in the arrays
  let disLikedMovies = getDislikedMovies().then(users=>userDislikedMovies = users.map(user=>user.movies.length));

  return new Promise((resolve, reject)=>{
    let usersWithMoreDislikedMovies=[];
    //wait until both arrays are filled and then compare the likes and dislikes for each user
    Promise.all([likedMovies,disLikedMovies,usersList]).then(()=>{
      for(let i=0; i<users.length; i++){
        if(userDislikedMovies[i]>userLikedMovies[i])
          usersWithMoreDislikedMovies.push(users[i]);
      }
      resolve(usersWithMoreDislikedMovies);
    }).catch(err=>{
      console.log(err.message);
      reject(err);
    });
  });
};

getUsersWithMoreDislikedMoviesThanLikedMovies().then((users) => {
  console.log("Users with more disliked movies than liked movies:");
  users.forEach((user) => {
    console.log(user.name, user.age);
  });
});
