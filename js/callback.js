/*
  CALLBACKS IN JAVASCRIPT

  DEFINITION:
  A callback is a function that is passed as an argument to another function,
  and is executed after some operation has been completed.

  The term "callback" comes from "call + back" - meaning the function will be
  called back at a later point in time.

  BASIC CONCEPT:
  - A function accepts another function as a parameter
  - This parameter function is called a "callback"
  - The callback is executed at a specific point in the code
  - Often used with asynchronous operations (timers, API calls, file reads, etc.)

  ========== BENEFITS OF CALLBACKS ==========

  1. ASYNCHRONOUS EXECUTION
     - Execute code after a time-consuming operation completes
     - Don't block the rest of the code from running
     - Essential for JavaScript's non-blocking nature

  2. EVENT-DRIVEN PROGRAMMING
     - Respond to user interactions (clicks, key presses, etc.)
     - Handle system events (data received, errors, etc.)

  3. FLEXIBILITY
     - Pass different functions to change behavior
     - Same function can be reused with different callbacks

  4. LAZY EXECUTION
     - Code is executed only when needed
     - Improves performance for unused operations

  ========== DRAWBACKS OF CALLBACKS ==========

  1. CALLBACK HELL (Pyramid of Doom)
     - Multiple nested callbacks become hard to read
     - Code indentation grows deeply
     - Difficult to follow the flow of execution
     - Example shown at the bottom - waterBoil -> addMasala -> serving chain

  2. ERROR HANDLING COMPLEXITY
     - Error handling becomes scattered and inconsistent
     - Each callback needs its own error handling
     - Difficult to propagate errors up the chain

  3. REDUCED READABILITY
     - Code reads inside-out (right to left)
     - Logic is split across multiple callbacks
     - Hard to understand the overall flow

  4. VARIABLE SHADOWING
     - Easy to accidentally shadow outer variables
     - Hard to debug variable scope issues

  5. LIMITED DEBUGGING
     - Stack traces become confusing
     - Harder to set breakpoints
     - Error source is not immediately clear

  ========== SOLUTIONS TO CALLBACK ISSUES ==========
  - Promises: Better error handling and chaining
  - async/await: More readable, synchronous-like syntax
  - Modular functions: Break callbacks into named functions
*/

// ========== EXAMPLE 1: BASIC CALLBACK WITH ASYNC OPERATION ==========
// function sayHi(cb) {
//   setTimeout(() => {
//     console.log("hi");
//     cb();  // Execute the callback after 8 seconds
//   }, 8000);
// }

// function bye(cb) {
//   console.log("bye");
// }

// sayHi(bye);  // Pass bye function as callback
// This will print "hi" after 8 seconds, then execute bye()

// ========== EXAMPLE 2: CALLBACK HELL (Pyramid of Doom) ==========
// This demonstrates the problem with deeply nested callbacks:
// - Hard to read (code flows right-to-left)
// - Every step depends on previous step
// - Difficult to handle errors for entire chain
// - Adding more steps makes it exponentially harder to read

function makeMagii(rawMagii, cb) {
  console.log("maggii aagya he"); // "maggi arrived"
  cb(); // Execute the callback (next step)
}

function waterBoil(cb) {
  console.log("pani ubal dia he"); // "water boiled"
  cb(); // Execute the callback (next step)
}

function addMasala(cb) {
  console.log("masala dal dia he"); // "spices added"
  cb(); // Execute the callback (next step)
}

function serving(cb) {
  console.log("maggi serve kr di he"); // "maggi served"
  cb(); // Execute the callback (next step)
}

// CALLBACK HELL EXAMPLE:
// Multiple nested callbacks - hard to read!
// This is called "pyramid of doom" or "callback hell"
makeMagii("ata maggi", () => {
  waterBoil(() => {
    addMasala(() => {
      serving(() => {
        console.log("magii ka kam khtm"); // "maggi task complete"
      });
    });
  });
});

// EXECUTION FLOW:
// 1. makeMagii() called
// 2. Calls first callback → waterBoil()
// 3. waterBoil() calls its callback → addMasala()
// 4. addMasala() calls its callback → serving()
// 5. serving() calls its callback → console.log("magii ka kam khtm")
