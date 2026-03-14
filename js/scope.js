/*
  SCOPE IN JAVASCRIPT

  Scope determines the accessibility of variables and functions in different parts
  of your code. It defines which variables a function can access.

  TYPES OF SCOPE:

  1. GLOBAL SCOPE
     - Variables declared outside all functions and blocks
     - Accessible from anywhere in the code
     - Created once when JavaScript starts running

  2. FUNCTION/LOCAL SCOPE
     - Variables declared inside a function
     - Only accessible within that function
     - Created each time a function is called
     - Called "function scope" regardless of var/let/const

  3. BLOCK SCOPE
     - Variables declared with 'let' or 'const' inside { }
     - Only accessible within that block
     - Introduced in ES6
     - 'var' does NOT have block scope (it's function-scoped)

  SCOPE CHAIN:
  - When a variable is used, JavaScript looks for it in:
    1. Current scope (local)
    2. Parent/outer scopes (enclosing functions)
    3. Global scope
    4. If not found, ReferenceError

  LEXICAL SCOPE (Static Scope):
  - A function's scope is determined by its position in the code
  - Inner functions can access outer function variables
  - Outer functions CANNOT access inner function variables

  CLOSURE:
  - A function that has access to variables from its outer scope
  - Even after the outer function has finished executing
  - Inner functions "remember" the variables of their parent scope
*/

// ========== EXAMPLE 1: BLOCK SCOPE ==========
// let a = 10;  // Global scope

// {
//   let a = 20;  // Block scope - shadows the global 'a'
// }
// console.log(a);  // Outputs: 10 (global a, not the block-scoped one)

// ========== EXAMPLE 2: SCOPE CHAIN ==========
// let a = 20;  // Global scope
// function outer() {
//   let a = 40;  // Function scope - shadows global 'a'
//   console.log(a);  // Outputs: 40 (uses local a)
// }
// outer();

// ========== EXAMPLE 3: BLOCK SCOPE WITH INACCESSIBLE VARIABLE ==========
// console.log(s);  // ReferenceError: s is not defined
// {
//   let s = 30;  // Block scope - only accessible here
// }
// s is NOT accessible outside the block

/*
  ========== EXAMPLE 4: CLOSURE (Most Important) ==========

  The function 'inner' forms a CLOSURE because:
  - It accesses variable 'a' from its outer function 'outer'
  - Even after 'outer' has finished executing, 'inner' still has access to 'a'
  - This is LEXICAL SCOPE in action - 'inner' remembers its parent scope

  Steps:
  1. outer() is called, creates local variable a = 10
  2. inner() is returned from outer()
  3. outer() execution completes, but its scope is NOT destroyed
  4. When res() is called, inner() still has access to variable 'a'
*/
let a = 10;
function outer() {
  let a = 10; // This variable is "captured" in the closure

  function inner() {
    console.log(a); // Accesses 'a' from outer scope (closure)
  }
  return inner; // Return the function, not the result
}

let res = outer(); // res now holds the inner function with closure
// console.log(res);  // [Function: inner]
res(); // Outputs: 10 (accesses 'a' from outer's scope via closure)
