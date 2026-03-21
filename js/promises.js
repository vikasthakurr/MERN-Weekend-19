// const res = fetch("https://api.github.com/users/vikasthakurr");
// console.log(res);

// const p1 = Promise.resolve("hi");
// p1.then(() => {})
//   .catch((err) => {})
//   .finally(() => {});
// console.log(p1);

// const p1 = Promise.reject("result1");
// const p2 = Promise.reject("error");
// const p3 = Promise.reject("result3");

// Promise.any([p1, p2, p3])
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// fetch("https://api.github.com/users/vikasthakurr")
//   .then((res) => res.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err))
//   .finally(() => {
//     console.log("api call done");
//   });

async function fetchData() {
  const response = await fetch("https://api.github.com/users/vikasthakurr");
  const data = await response.json();
  console.log(data);
}
fetchData();
