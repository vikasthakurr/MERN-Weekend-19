// let a = 10;

// {
//   let a = 20;
// }

// let a = 20;
// function outer() {
// //   let a = 40;
//   console.log(a);
// }

// outer();
// console.log(s);
// {
//   let s = 30;
// }

// let a = 10;
function outer() {
  let a = 10;

  function inner() {
    console.log(a);
  }
  return inner;
}
let res = outer();
// console.log(res);
res();
