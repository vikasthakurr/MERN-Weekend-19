/*
  CURRYING IN JAVASCRIPT

  Currying is a functional programming technique that transforms a function
  with multiple parameters into a sequence of functions, each taking a single
  parameter. Instead of calling f(a, b, c) all at once, you call f(a)(b)(c).

  Benefits of Currying:
  1. Partial Application - You can fix some arguments and create specialized functions
  2. Function Composition - Makes it easier to combine smaller functions
  3. Readable Code - Breaking down complex operations into simpler steps
  4. Reusability - Create variations of functions by fixing certain arguments

  Two approaches shown below:
  - Normal function (commented out)
  - Curried function (using nested returns)
*/

// NORMAL APPROACH (without currying):
// function mail(to, sub, body) {
//   console.log(
//     `mail has been sent to ${to}, with subject ${sub} and body ${body}`,
//   );
// }
//
// All parameters must be provided at once:
// mail("welcome back", "hii", "some body content");

// CURRIED APPROACH:
// Each parameter is passed one at a time through a chain of functions
// This means each function takes ONE parameter and returns another function
function mail(to) {
  return function (sub) {
    return function (body) {
      console.log(
        `mail has been sent to ${to}, subject ${sub} with body: ${body}`,
      );
    };
  };
}

// Calling a curried function requires passing one argument at each level:
// The parentheses can be chained: mail(arg1)(arg2)(arg3)
// This is equivalent to:
// const step1 = mail("abc@gmail.com");  // Returns a function waiting for sub
// const step2 = step1("order placed");   // Returns a function waiting for body
// const step3 = step2("samsung");        // Executes the function

mail("abc@gmail.com")("order placed")("samsung");
