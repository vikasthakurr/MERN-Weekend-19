/*
  CONDITIONALS IN JAVASCRIPT
  ==========================

  Conditionals let your program make decisions based on conditions.
  JavaScript has three main ways to write conditionals:

  1) if / else if / else
  2) Ternary operator (shorthand for if/else)
  3) switch statement

  -------------------------------------------------------
  1) IF / ELSE IF / ELSE
  -------------------------------------------------------
  Syntax:
    if (condition) {
      // runs when condition is true
    } else if (anotherCondition) {
      // runs when first is false but this is true
    } else {
      // runs when all conditions above are false
    }

  -------------------------------------------------------
  2) TERNARY OPERATOR
  -------------------------------------------------------
  Shorthand for simple if/else.
  Syntax: condition ? valueIfTrue : valueIfFalse

  Example:
    let result = age > 18 ? "can vote" : "can't vote";

  Use when you need a quick one-liner. Avoid nesting ternaries
  as they become hard to read.

  -------------------------------------------------------
  3) SWITCH STATEMENT
  -------------------------------------------------------
  Best used when comparing ONE variable against MANY possible values.
  More readable than a long chain of if/else if.

  Syntax:
    switch (variable) {
      case value1:
        // code
        break;  // IMPORTANT: break stops falling through to next case
      case value2:
        // code
        break;
      default:
        // runs if no case matches (like the final else)
    }

  NOTE: Without 'break', execution "falls through" to the next case.
  This is sometimes intentional but usually a bug if forgotten.
*/

let age = 17;

// -------------------------------------------------------
// EXAMPLE 1: if / else
// -------------------------------------------------------
// if (age > 18) {
//   console.log("you can vote");
// } else {
//   console.log("you can't vote");
// }

// -------------------------------------------------------
// EXAMPLE 2: Ternary operator (same logic, one line)
// -------------------------------------------------------
// console.log(age > 18 ? "can vote" : "cant vote");

// -------------------------------------------------------
// EXAMPLE 3: switch statement
// -------------------------------------------------------
// let day = 5;

// switch (day) {
//   case 1:
//     console.log("Monday");
//     break;
//   case 2:
//     console.log("Tuesday");
//     break;
//   case 3:
//     console.log("Wednesday");
//     break;
//   case 4:
//     console.log("Thursday");
//     break;
//   case 5:
//     console.log("Friday");   // day = 5, so this runs
//     break;
//   case 6:
//     console.log("Saturday");
//     break;
//   case 7:
//     console.log("Sunday");
//     break;
//   default:
//     console.log("Invalid day"); // runs if day is not 1-7
// }
