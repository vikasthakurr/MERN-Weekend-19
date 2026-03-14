// /*
// JavaScript runs code in execution contexts.
// Main types:
// 1) Global Execution Context (created first, only one per program)
// 2) Function Execution Context (created whenever a function is called)
// 3) Eval context (rare, from eval - generally avoided)

// --------------------------------------------------------------------
// WHAT IS GLOBAL EXECUTION CONTEXT?
// --------------------------------------------------------------------

// When JS file starts, engine creates GEC.
// In browser:
// - global object = window
// - this (in global non-module script) points to window

// In Node.js:
// - global object differs (globalThis / module environment)

// GEC has two major phases:

// 1) Memory Creation Phase (also called Creation/Hoisting phase)
//    - Space is allocated for variables and functions.
//    - var variables are initialized with undefined.
//    - let/const are hoisted but remain in TDZ (cannot access before line).
//    - Function declarations are stored with full function body.

// 2) Code Execution Phase
//    - Code runs line by line.
//    - Variables get actual assigned values.
//    - Function calls create new Function Execution Contexts (FEC).

// --------------------------------------------------------------------
// CALL STACK (Execution order)
// --------------------------------------------------------------------

// - JS is single-threaded and executes one thing at a time.
// - It uses a Call Stack (LIFO: Last In, First Out).

// Flow:
// 1) GEC pushed to stack.
// 2) On function call -> new FEC pushed.
// 3) Function completes -> FEC popped.
// 4) After all code ends -> GEC popped.

// --------------------------------------------------------------------
// STEP-BY-STEP TRACE EXAMPLE
// --------------------------------------------------------------------

// Code:
// // var a = 10;
// // function square(n) {
// //   return n * n;
// // }
// // var result = square(a);
// // console.log(result);

// Engine view:
// Creation phase:
// - a -> undefined
// - square -> full function definition
// - result -> undefined

// Execution phase:
// - a = 10
// - result = square(a)  -> creates FEC for square with n = 10
// - square returns 100
// - result = 100
// - console.log(100)

// --------------------------------------------------------------------
// HOISTING QUICK RULES
// --------------------------------------------------------------------

// 1) var: hoisted + initialized as undefined
// 2) let/const: hoisted but in TDZ until declaration line
// 3) function declaration: fully hoisted
// 4) function expression (var/let/const fn = ...):
//    follows variable rules (not fully callable before assignment)

// --------------------------------------------------------------------
// WHY THIS MATTERS
// --------------------------------------------------------------------

// Understanding execution context helps with:
// - Hoisting confusion
// - "Cannot access before initialization" errors
// - Scope and closure understanding
// - Debugging call stack issues

// */

// // Practice: uncomment and run to connect theory with output
// // var a = 10;
// // function double(num) {
// //   return num * 2;
// // }
// // var result = double(a);
// // console.log(result); // 20
// function outer() {
//   let a = 10;

//   function inner() {
//     console.log(a);
//   }
//   return inner;
// }
// let res = outer();
// // console.log(res);
// res();


//  console.log(this);

function mail(to) {
  return function (sub) {
    return function (body) {
      console.log(
        `mail has been sent to ${to}, subject ${sub} with body: ${body}`,
      );
    };
  };
}

mail("abc@gmail.com")("order placed")("samsung");