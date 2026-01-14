/*
Challenge 1

"Time difference calculator"

The function timeDifference accepts two positive numbers representing time in seconds. You should modify the function to return the difference between the two times in a human-readable format HH:MM:SS.

Requirements:
- The function should accept two positive numbers representing time in seconds.
- The function should return the absolute difference between the two times.
- The result should be formatted as HH:MM:SS.

Example:

timeDifference(7200, 3400); // Expected output: "01:03:20"

*/

const timeDifference = (a, b) => {
  if (b > a) {
    //Ensure A is greater or equal than B
    [b, a] = [a, b];
  }
  //Calculate the difference with consecutive divisions
  let differenceInSeconds = a - b;
  let hours = Math.trunc(differenceInSeconds / 3600);
  differenceInSeconds %= 3600;
  let minutes = Math.trunc(differenceInSeconds / 60);
  differenceInSeconds %= 60;
  let seconds = differenceInSeconds;
  let formattedTime =
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
};

module.exports = timeDifference;
