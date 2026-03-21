/*
  LOOPS IN JAVASCRIPT
  ===================

  Loops let you repeat a block of code multiple times.
  Instead of writing the same line 10 times, use a loop.

  -------------------------------------------------------
  1) FOR LOOP
  -------------------------------------------------------
  Best when you know exactly how many times to repeat.

  Syntax:
    for (initialization; condition; update) {
      // code to repeat
    }

  - initialization: runs once at the start (e.g. let i = 0)
  - condition: checked before each iteration; loop stops when false
  - update: runs after each iteration (e.g. i++)

  Example: print 0 to 9
*/

// console.log("*")

// for (let i = 0; i < 10; i++) {
//   console.log(i); // prints 0, 1, 2, ... 9
// }

/*
  -------------------------------------------------------
  2) WHILE LOOP
  -------------------------------------------------------
  Best when you don't know how many times to repeat upfront.
  Keeps running as long as the condition is true.

  Syntax:
    while (condition) {
      // code
    }

  Example:
    let i = 0;
    while (i < 5) {
      console.log(i);
      i++; // IMPORTANT: always update to avoid infinite loop
    }

  -------------------------------------------------------
  3) DO...WHILE LOOP
  -------------------------------------------------------
  Like while, but runs the code AT LEAST ONCE before checking condition.

  Syntax:
    do {
      // code
    } while (condition);

  Example:
    let i = 0;
    do {
      console.log(i);
      i++;
    } while (i < 3);

  -------------------------------------------------------
  4) FOR...OF LOOP (ES6+)
  -------------------------------------------------------
  Best for iterating over arrays, strings, or any iterable.
  Gives you the VALUE directly.

  Syntax:
    for (let element of array) {
      // use element
    }

  Example:
    let fruits = ["apple", "mango", "cherry"];
    for (let fruit of fruits) {
      console.log(fruit); // apple, mango, cherry
    }

  -------------------------------------------------------
  5) FOR...IN LOOP
  -------------------------------------------------------
  Best for iterating over OBJECT KEYS (properties).

  Syntax:
    for (let key in object) {
      // use key or object[key]
    }

  Example:
    let person = { name: "Vikas", age: 25 };
    for (let key in person) {
      console.log(key, person[key]); // name Vikas, age 25
    }

  -------------------------------------------------------
  6) ARRAY.FOREACH() - Higher Order Function
  -------------------------------------------------------
  A cleaner way to loop over arrays using a callback function.
  Cannot use break or continue inside forEach.

  Syntax:
    array.forEach((element, index) => {
      // use element or index
    });
*/

// let arr = [1, 34, 6, 7, 78];

// arr.forEach((ele) => {
//   console.log(ele); // prints each element: 1, 34, 6, 7, 78
// });

/*
  -------------------------------------------------------
  LOOP CONTROL KEYWORDS
  -------------------------------------------------------

  break    - Exits the loop immediately
  continue - Skips the current iteration and moves to the next

  Example with break:
    for (let i = 0; i < 10; i++) {
      if (i === 5) break;    // stops at 5
      console.log(i);        // prints 0, 1, 2, 3, 4
    }

  Example with continue:
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue; // skips 2
      console.log(i);        // prints 0, 1, 3, 4
    }

  -------------------------------------------------------
  QUICK COMPARISON
  -------------------------------------------------------
  for         → when you know the count
  while       → when condition-based, unknown count
  do...while  → when you need at least one execution
  for...of    → iterating array/string values
  for...in    → iterating object keys
  forEach     → clean array iteration with callback
*/
