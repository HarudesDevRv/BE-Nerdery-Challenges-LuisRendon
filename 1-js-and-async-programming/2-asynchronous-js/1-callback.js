/*
    Challenge 1: "Make a request with retries"
    
    The function makeRequest under utils/make-requests accepts a number representing the number of attempts to make a request. If the request fails, it should retry up to the specified number of attempts. If all attempts fail, it should return an error message.
    
    Requirements:
    - You should work only within the method in this file
    - The function should accept a number representing the number of attempts.
    - The function should make a request and retry if it fails.
    - If all attempts fail, it should return an error message.
    - The function should not modify the original number of attempts.
    - The function should handle network errors gracefully.
    - The function should not use any external libraries.

    Example:
    makeRequestWithRetries(3); // Expected output: "Request successful on attempt X" or "All attempts failed."


*/

const makeRequest = require("./utils/make-requests");

const makeRequestWithRetries = (attempts) => {
  function myCallback(err,data){
    if(err){
      let message = err?.message;//Search for the attempts inside the message
      let tries = parseInt(message.slice(26));
      if(tries<attempts){//Validate there are remaining attempts and try again
          return makeRequest(tries+1,myCallback);
      }
      else{//Return an error if all attempts failed
        console.log("All attempts failed.");
        return Error("All attempts failed.");
      }
    }else if(data){//Return how many attempts where needed
      console.log(data);
      return data;
    }else{
      console.log("Something went wrong");
      return Error("Something went wrong");
    }
  }
  //Begin requesting
  makeRequest(1,myCallback);
};

makeRequestWithRetries(10);
