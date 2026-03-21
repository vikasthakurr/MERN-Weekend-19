/*
  DEBOUNCE AND THROTTLE IN JAVASCRIPT
  =====================================

  Both are performance optimization techniques used to control how often
  a function gets called, especially for events that fire very rapidly
  (like typing, scrolling, resizing, or button clicks).

  -------------------------------------------------------
  THE PROBLEM
  -------------------------------------------------------
  Imagine a search box. Every keystroke fires an event.
  Without control, you'd make an API call on EVERY single keystroke.
  That's wasteful and can crash your server.

  Solution: Debounce or Throttle the function.

  -------------------------------------------------------
  DEBOUNCE
  -------------------------------------------------------
  "Wait until the user STOPS doing something, THEN run the function."

  How it works:
  - Every time the function is called, it resets a timer.
  - The actual function only runs after the user has STOPPED
    calling it for the specified delay period.

  Real-world analogy:
  - Elevator door: It waits for everyone to get in.
    Every time someone new enters, the timer resets.
    Door closes only after no one enters for a few seconds.

  Use cases:
  - Search input (wait until user stops typing)
  - Window resize handler
  - Form validation on input

  Syntax:
    function debounce(fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);       // cancel previous timer
        timer = setTimeout(() => {
          fn(...args);             // run only after delay with no new calls
        }, delay);
      };
    }
*/

// DEBOUNCE IMPLEMENTATION (uncomment to use):
// function searchWithDebounce(fn, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);   // reset the timer on every call
//     timer = setTimeout(() => {
//       fn(...args);         // only fires after 'delay' ms of silence
//     }, delay);
//   };
// }

/*
  -------------------------------------------------------
  THROTTLE
  -------------------------------------------------------
  "Run the function at most ONCE every X milliseconds, no matter
  how many times it's called."

  How it works:
  - Records the timestamp of the last call.
  - Only allows the function to run if enough time has passed
    since the last execution.

  Real-world analogy:
  - A gun that can only fire once per second.
    No matter how fast you pull the trigger, it fires at most once/sec.

  Use cases:
  - Scroll event handler (update UI at most every 300ms)
  - Button click (prevent double-submit)
  - Mouse move / drag events
  - Game input handling

  Key difference from Debounce:
  - Debounce: waits for INACTIVITY, then fires ONCE
  - Throttle: fires at REGULAR INTERVALS during activity

  ┌──────────────┬──────────────────────────────────────────────┐
  │              │ Debounce              │ Throttle              │
  ├──────────────┼───────────────────────┼───────────────────────┤
  │ When fires   │ After user stops      │ At regular intervals  │
  │ Use case     │ Search input          │ Scroll / resize       │
  │ Calls        │ Once after silence    │ Once per interval     │
  └──────────────┴───────────────────────┴───────────────────────┘
*/

// THROTTLE IMPLEMENTATION:
function searchWithThrottle(fn, delay) {
  let Lastcall = 0; // timestamp of the last time fn was actually called

  return function (...args) {
    let currentCall = Date.now(); // current timestamp in milliseconds

    // Only call fn if enough time has passed since the last call
    if (currentCall - Lastcall >= delay) {
      fn(...args);           // execute the actual function
      Lastcall = currentCall; // update the last call timestamp
    }
    // If not enough time has passed, this call is silently ignored
  };
}

// The actual function we want to throttle:
function search(name) {
  console.log(`searching for ${name}`);
}

// Wrap search with throttle (max once every 300ms):
const searchInput = searchWithThrottle(search, 300);

// Simulate rapid calls (like a user typing fast):
searchInput("vikas");              // ✅ runs (first call, no previous timestamp)
searchInput("vikas singh");        // ❌ ignored (called too soon after first)
searchInput("vikas kumar thakur"); // ❌ ignored (still within 300ms window)

// To test debounce instead, swap the line above with:
// const searchInput = searchWithDebounce(search, 3000);
// Then only the LAST call fires, after 3 seconds of no new calls.

// Without throttle/debounce (every call runs):
// search("vikas");
// search("vikas kumar");
// search("vikas kumar thakur");
