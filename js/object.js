// let person = {
//   fname: "vikas",
//   lname: "thakur",
//   address: {
//     city: "jaipur",
//   },
// };

// let { lname } = person;
// console.log(lname);
// let { city } = person;
// console.log(city);

// console.log(person.fname);
// console.log(Object.entries(person));
// Object.seal(person);
// Object.freeze(person);
// // person.fname = "aman";

// person.salary=1234
// console.log(person);

// let person = new Object();
// person.fname = "vikas";

// let person = {
//   fname: "vikas",
//   lname: "thakur",
//   address: {
//     city: "jaipur",
//   },
// };

// // let person2 = person;
// // let person2 = { ...person };
// // let person2 = structuredClone(person);
// // let person2 = JSON.parse(JSON.stringify(person));
// let person2 = JSON.stringify(person);
// let step2 = JSON.parse(person2);
// // person2.address.city = "agra";
// console.log(step2);
// console.log(person);

// let fruits = ["apple", "mango", "cherry"];
// let [second, ...rest] = fruits;
// // console.log(first);
// console.log(second);
// console.log(rest[0]);

let obj1 = {
  fname: "vikas",
  age: 25,
  print: function (city) {
    console.log(this.fname, this.age, city);
  },
};

// obj1.print();

let obj2 = {
  fname: "akash",
  age: 20,
};

//call

// obj1.print.call(obj2, "etawah");
// obj1.print.apply(obj2, ["agra"]);\
// obj1.print.bind(obj2, "jaipur")();
// console.log(res)
