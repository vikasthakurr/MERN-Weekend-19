/*
  PROMISES AND ASYNC/AWAIT IN JAVASCRIPT
  =======================================

  Promises are JavaScript's solution to "callback hell".
  They represent a value that may be available NOW, in the FUTURE, or NEVER.

  -------------------------------------------------------
  PROMISE STATES
  -------------------------------------------------------
  A Promise is always in one of three states:

  1) PENDING   → initial state, operation not yet complete
  2) FULFILLED → operation completed successfully (resolved)
  3) REJECTED  → operation failed (rejected)

  Once a promise is fulfilled or rejected, it CANNOT change state.

  -------------------------------------------------------
  CREATING A PROMISE
  -------------------------------------------------------
  const p = new Promise((resolve, reject) => {
    // do async work...
    if (success) {
      resolve(data);   // fulfills the promise
    } else {
      reject(error);   // rejects the promise
    }
  });

  -------------------------------------------------------
  CONSUMING A PROMISE
  -------------------------------------------------------
  p.then(data => { ... })    → runs when promise is fulfilled
   .catch(err => { ... })    → runs when promise is rejected
   .finally(() => { ... })   → runs ALWAYS (fulfilled or rejected)

  -------------------------------------------------------
  PROMISE COMBINATORS
  -------------------------------------------------------
  When you have MULTIPLE promises and need to handle them together:

  Promise.all([p1, p2, p3])
  → Waits for ALL to fulfill. If ANY rejects, immediately rejects.
  → Returns array of all results.
  → Use when all results are needed.

  Promise.allSettled([p1, p2, p3])
  → Waits for ALL to settle (fulfill or reject).
  → Never rejects. Returns array of { status, value/reason }.
  → Use when you want all results regardless of failures.

  Promise.race([p1, p2, p3])
  → Resolves/rejects as soon as the FIRST one settles.
  → Use for timeouts or "fastest wins" scenarios.

  Promise.any([p1, p2, p3])
  → Resolves as soon as the FIRST one FULFILLS.
  → Only rejects if ALL promises reject (AggregateError).
  → Use when you need at least one success.

  -------------------------------------------------------
  ASYNC / AWAIT (ES2017+)
  -------------------------------------------------------
  async/await is syntactic sugar over Promises.
  It makes async code look and read like synchronous code.

  Rules:
  - 'async' before a function makes it return a Promise automatically
  - 'await' pauses execution inside the async function until the Promise settles
  - 'await' can only be used INSIDE an async function

  Error handling with async/await:
  Use try/catch instead of .catch()

  async function fetchData() {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log("Error:", err);
    }
  }
*/

// -------------------------------------------------------
// EXAMPLE 1: fetch() returns a Promise
// -------------------------------------------------------
// fetch() makes an HTTP request and returns a Promise.
// The Promise resolves with a Response object.
// We must call .json() to parse the body (also returns a Promise).

// const res = fetch("https://api.github.com/users/vikasthakurr");
// console.log(res); // Promise { <pending> } — not the data yet!

// -------------------------------------------------------
// EXAMPLE 2: Promise.resolve and .then/.catch/.finally
// -------------------------------------------------------
// const p1 = Promise.resolve("hi"); // creates an already-fulfilled promise
// p1.then((data) => { console.log(data); }) // "hi"
//   .catch((err) => { console.log(err); })  // won't run (no error)
//   .finally(() => { console.log("done"); }); // always runs

// -------------------------------------------------------
// EXAMPLE 3: Promise.any — first fulfilled wins
// -------------------------------------------------------
// const p1 = Promise.reject("result1"); // rejected
// const p2 = Promise.reject("error");   // rejected
// const p3 = Promise.reject("result3"); // rejected

// Promise.any([p1, p2, p3])
//   .then((data) => {
//     console.log(data); // won't run — all rejected
//   })
//   .catch((err) => {
//     // AggregateError: All promises were rejected
//     console.log(err);
//   });

// -------------------------------------------------------
// EXAMPLE 4: fetch with .then chaining
// -------------------------------------------------------
// fetch("https://api.github.com/users/vikasthakurr")
//   .then((res) => res.json())          // parse response body as JSON
//   .then((data) => console.log(data))  // use the parsed data
//   .catch((err) => console.log(err))   // handle any error in the chain
//   .finally(() => {
//     console.log("api call done");      // always runs after success or failure
//   });

// -------------------------------------------------------
// EXAMPLE 5: async/await (cleaner version of the above)
// -------------------------------------------------------
// 'async' makes this function return a Promise automatically.
// 'await' pauses here until fetch() resolves, then continues.
async function fetchData() {
  // await pauses until the HTTP response arrives
  const response = await fetch("https://api.github.com/users/vikasthakurr");

  // await pauses again until the JSON body is parsed
  const data = await response.json();

  console.log(data); // now we have the actual data object
}

fetchData(); // call the async function (returns a Promise, but we ignore it here)

/*
  -------------------------------------------------------
  COMPARISON: .then() vs async/await
  -------------------------------------------------------

  .then() chaining:
    fetch(url)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

  async/await (same thing, more readable):
    async function load() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }

  Both approaches are valid. async/await is preferred for readability.
*/
