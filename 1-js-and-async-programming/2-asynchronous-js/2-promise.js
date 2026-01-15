/*
  Challenge 2: Users Who Dislike More Movies Than They Like

  Get a list of users who have rated more movies negatively than positively.

  Use the methods in utils/mocked-api to retrieve user and rating data.
  Check how many movies each user liked and disliked, then return only those with more dislikes.

  Requirements:
  - Use only Promise static methods (e.g., Promise.all, Promise.then, etc.) to handle the results
  - Only print the user information in the output—no extra text or formatting

 */

const {
  getLikedMovies,
  getUsers,
  getDislikedMovies,
} = require("./utils/mocked-api");

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
  //Retrieve de users, liked movies and disliked movies lists
  return new Promise((resolve, reject) => {
    //Wait until both arrays are filled and then compare the likes and dislikes for each user
    Promise.all([getLikedMovies(), getDislikedMovies(), getUsers()])
      .then((results) => {
        let usersWithMoreDislikedMovies = [];
        let [userLikedMovies, userDislikedMovies, users] = results;
        for (let i = 0; i < users.length; i++) {
          if (
            userDislikedMovies[i].movies.length >
            userLikedMovies[i].movies.length
          )
            usersWithMoreDislikedMovies.push(users[i]);
        }
        resolve(usersWithMoreDislikedMovies);
      })
      .catch((err) => {
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
