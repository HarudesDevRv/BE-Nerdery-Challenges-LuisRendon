/* 
Challenge: "Find Majority Element";

The function findMajorityElement accepts an array of numbers and returns the majority element if it exists, otherwise returns null. The majority element is the element that appears more than n/2 (floor of that division) times in the array.

Requirements:
- The function should handle arrays of any length.
- The function should return the majority element if it exists, otherwise return null.
- The function should be efficient and handle large arrays.
- The function should not modify the original array.

Example:
findMajorityElement([1, 2, 3, 1, 1]); // Expected output: 1
findMajorityElement([1, 2, 3, 4]); // Expected output: null
findMajorityElement([1, 1, 2, 2, 2]); // Expected output: 2
findMajorityElement([1, 2, 2, 3, 3, 3]); // Expected output: null
findMajorityElement([1, 2, 3, 4, 5]); // Expected output: null


*/

const findMajorityElement = (arr) => {
  //use a map to store the count of each numeric value
  let numbersCount = new Map();
  for (let number of arr) {
    if (numbersCount.has(number)) {
      numbersCount.set(number, numbersCount.get(number) + 1);
    } else {
      numbersCount.set(number, 1);
    }
  }
  //look if there is a value on the map higher than arr length/2
  for (let pair of numbersCount) {
    if (pair[1] > Math.floor(arr.length / 2)) return pair[0];
  }
  return null;
};

module.exports = findMajorityElement;
