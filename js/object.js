/*
  OBJECTS IN JAVASCRIPT
  =====================

  An object is a collection of key-value pairs (properties).
  It's used to group related data and behavior together.

  -------------------------------------------------------
  CREATING OBJECTS
  -------------------------------------------------------

  1) Object Literal (most common):
     let person = { name: "Vikas", age: 25 };

  2) new Object():
     let person = new Object();
     person.name = "Vikas";

  3) Constructor Function / Class (for multiple instances)

  -------------------------------------------------------
  ACCESSING PROPERTIES
  -------------------------------------------------------
  - Dot notation:     person.fname
  - Bracket notation: person["fname"]  (useful for dynamic keys)

  -------------------------------------------------------
  DESTRUCTURING
  -------------------------------------------------------
  Extract properties into variables cleanly.

  let { fname, lname } = person;
  // Same as: let fname = person.fname; let lname = person.lname;

  Nested destructuring:
  let { address: { city } } = person;
  // Extracts city from nested address object

  -------------------------------------------------------
  USEFUL OBJECT METHODS
  -------------------------------------------------------
  Object.keys(obj)    → array of keys
  Object.values(obj)  → array of values
  Object.entries(obj) → array of [key, value] pairs

  -------------------------------------------------------
  OBJECT.SEAL vs OBJECT.FREEZE
  -------------------------------------------------------
  Object.seal(obj)   → can UPDATE existing properties, but cannot ADD or DELETE
  Object.freeze(obj) → cannot UPDATE, ADD, or DELETE any property (fully locked)

  -------------------------------------------------------
  COPYING OBJECTS
  -------------------------------------------------------
  Shallow copy (nested objects still share reference):
    let copy = { ...person };           // spread operator
    let copy = Object.assign({}, person);

  Deep copy (fully independent, including nested):
    let copy = structuredClone(person);                    // modern, recommended
    let copy = JSON.parse(JSON.stringify(person));         // older approach, loses functions/dates

  -------------------------------------------------------
  ARRAY DESTRUCTURING (bonus)
  -------------------------------------------------------
  let fruits = ["apple", "mango", "cherry"];
  let [first, second, ...rest] = fruits;
  // first = "apple", second = "mango", rest = ["cherry"]

  -------------------------------------------------------
  CALL, APPLY, BIND
  -------------------------------------------------------
  These methods let you borrow a function from one object
  and use it with a different object's 'this'.

  call(obj, arg1, arg2)   → calls immediately, args passed one by one
  apply(obj, [arg1, arg2])→ calls immediately, args passed as array
  bind(obj, arg1)         → returns a NEW function (doesn't call immediately)
*/

// -------------------------------------------------------
// EXAMPLE 1: Basic object and property access
// -------------------------------------------------------
// let person = {
//   fname: "vikas",
//   lname: "thakur",
//   address: {
//     city: "jaipur",
//   },
// };

// Destructuring top-level property:
// let { lname } = person;
// console.log(lname); // "thakur"

// Destructuring nested property:
// let { address: { city } } = person;
// console.log(city); // "jaipur"

// Dot notation access:
// console.log(person.fname); // "vikas"

// Object.entries returns array of [key, value] pairs:
// console.log(Object.entries(person));

// Object.seal: can update but not add/delete
// Object.seal(person);
// person.fname = "aman"; // allowed (update)
// person.salary = 1234;  // silently ignored (can't add new property)
// console.log(person);

// Object.freeze: nothing can change
// Object.freeze(person);
// person.fname = "aman"; // silently ignored
// console.log(person);

// -------------------------------------------------------
// EXAMPLE 2: new Object() syntax
// -------------------------------------------------------
// let person = new Object();
// person.fname = "vikas"; // adding properties after creation

// -------------------------------------------------------
// EXAMPLE 3: Copying objects
// -------------------------------------------------------
// let person = {
//   fname: "vikas",
//   lname: "thakur",
//   address: {
//     city: "jaipur",
//   },
// };

// Shallow copy with spread (nested address still shared):
// let person2 = { ...person };

// Deep copy with structuredClone (fully independent):
// let person2 = structuredClone(person);

// Deep copy with JSON (loses functions/undefined/Date):
// let person2 = JSON.parse(JSON.stringify(person));

// person2.address.city = "agra"; // with shallow copy, this changes person too!
// console.log(person2);
// console.log(person);

// -------------------------------------------------------
// EXAMPLE 4: Array destructuring
// -------------------------------------------------------
// let fruits = ["apple", "mango", "cherry"];
// let [second, ...rest] = fruits;
// console.log(second); // "apple" (first element)
// console.log(rest[0]); // "mango" (rest is ["mango", "cherry"])

// -------------------------------------------------------
// EXAMPLE 5: call, apply, bind
// -------------------------------------------------------
let obj1 = {
  fname: "vikas",
  age: 25,
  print: function (city) {
    // 'this' refers to the object that calls this method
    console.log(this.fname, this.age, city);
  },
};

let obj2 = {
  fname: "akash",
  age: 20,
};

// obj1.print.call(obj2, "etawah");
// → Calls print() with obj2 as 'this', city = "etawah"
// → Output: "akash 20 etawah"

// obj1.print.apply(obj2, ["agra"]);
// → Same as call but arguments passed as array
// → Output: "akash 20 agra"

// obj1.print.bind(obj2, "jaipur")();
// → bind returns a NEW function with obj2 as 'this'
// → The () at the end immediately calls that new function
// → Output: "akash 20 jaipur"
