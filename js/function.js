/*
  FUNCTIONS IN JAVASCRIPT
  =======================

  A function is a reusable block of code that performs a specific task.
  You define it once and call it as many times as needed.

  WHY USE FUNCTIONS?
  - Avoid repeating code (DRY: Don't Repeat Yourself)
  - Break complex problems into smaller pieces
  - Make code easier to read, test, and maintain

  -------------------------------------------------------
  TYPES OF FUNCTIONS IN JAVASCRIPT
  -------------------------------------------------------

  1) FUNCTION DECLARATION
     - Defined using the 'function' keyword
     - Hoisted: can be called BEFORE the line it's defined on
     - Has its own 'this' context

     Syntax:
       function functionName(parameters) {
         // code
         return value; // optional
       }
       functionName(); // call it
*/

// function abc() {
//   // code goes here
// }
// abc(); // calling the function

/*
  2) FUNCTION EXPRESSION
     - Function stored in a variable
     - NOT hoisted: cannot be called before the line it's defined on
     - Can be anonymous (no name after 'function' keyword)

     Syntax:
       let myFunc = function() { ... };
       myFunc(); // call it
*/

// let test = function () {};
// test();

/*
  3) ARROW FUNCTION (ES6+)
     - Shorter syntax using =>
     - Does NOT have its own 'this' (inherits from surrounding scope)
     - Great for callbacks and short functions

     Syntax:
       let myFunc = () => { ... };
       let myFunc = (param) => expression; // implicit return for single expression

     With destructuring:
       let res = ({ fname, lname }) => console.log(fname, lname);
       // Destructures an object parameter directly in the signature
*/

// let res = ({ fname, lname }) => console.log("object");

/*
  4) IIFE (Immediately Invoked Function Expression)
     - A function that runs immediately after it's defined
     - Useful for creating a private scope (variables inside don't leak out)
     - Common pattern before ES6 modules existed

     Syntax:
       (() => { ... })();   // arrow function IIFE
       (function abc() { ... })();  // named function IIFE

     The outer () wraps the function to make it an expression.
     The final () immediately calls it.
*/

// Arrow function IIFE:
// (() => {})();

// Named function IIFE:
// (function abc() {})();

/*
  -------------------------------------------------------
  PARAMETERS vs ARGUMENTS
  -------------------------------------------------------
  - Parameters: variable names in the function definition
  - Arguments: actual values passed when calling the function

  Example:
    function greet(name) {   // 'name' is a parameter
      console.log("Hello", name);
    }
    greet("Vikas");           // "Vikas" is an argument

  -------------------------------------------------------
  RETURN VALUES
  -------------------------------------------------------
  - Use 'return' to send a value back from a function
  - Without return, the function returns undefined
  - return also stops function execution immediately

  Example:
    function add(a, b) {
      return a + b;  // sends result back to caller
    }
    let sum = add(3, 4); // sum = 7

  -------------------------------------------------------
  DEFAULT PARAMETERS (ES6+)
  -------------------------------------------------------
  You can set default values for parameters in case they're not passed.

  Example:
    function greet(name = "Student") {
      console.log("Hello", name);
    }
    greet();          // "Hello Student"
    greet("Vikas");   // "Hello Vikas"

  -------------------------------------------------------
  REST PARAMETERS (ES6+)
  -------------------------------------------------------
  Collect all remaining arguments into an array using ...

  Example:
    function sum(...numbers) {
      return numbers.reduce((total, n) => total + n, 0);
    }
    sum(1, 2, 3, 4); // 10
*/
