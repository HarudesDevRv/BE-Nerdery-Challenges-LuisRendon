/*
Challenge 3

"Factorial Chain"

The function factorialChain accepts two arguments: length and lastDigits.

The length tells you how many numbers to include in the series, and your job is to calculate the factorial of each number from 1 to length, then sum all those factorials.

lastDigits indicates how many digits from the end of the final sum should be returned, as a string.

Example:

factorialChain(5, 3); // Expected output: "153"
factorialChain(5, 1); // Expected output: "3
factorialChain(5,5); // Expected output: "00153"

1! = 1  
2! = 2  
3! = 6  
4! = 24  
5! = 120  
Total = 153 

Requirements:
- The function should accept two positive integers.
- The first integer (length) should represent the number of terms in the series.
- The second integer (lastDigits) should represent how many digits from the end of the final sum should be returned.
- The function should return the lastDigits digits of the sum as a string.
- In case the sum has fewer digits than lastDigits, the function should return the sum padded with leading zeros to match the length of lastDigits.

*/

//factorial sum implementation
function factorialSum(n) {
  let factor = 1;
  let sum = 1;
  for (let i = 2; i <= n; i++) {
    factor *= i;
    sum += factor;
  }
  return sum.toString();
}

const factorialChain = (number, lastDigits) => {
  let sum = factorialSum(number);

  //modifying the sum string acording to lastDigits
  if (lastDigits === sum.length) {
    return sum;
  } else if (lastDigits < sum.length) {
    return sum.slice(-lastDigits);
  } else {
    return sum.padStart(lastDigits, "0");
  }
};

module.exports = factorialChain;
