// let arr = [1, 2, 3, 4];

// // arr.forEach(() => {});

let salary = [1000, 2000, 3000, 4000];
let salary2 = [100, 200, 400, 600];



function calculateTwentyPercent(salary) {
  return salary * 0.2;
}

function calculateThirtyPercent(salary) {
  return salary * 0.3;
}

//fun(salry,tenpercent)

Array.prototype.calculateTax = function (cb) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(cb(this[i]));
  }
  return res;
};

// console.log(calculateTax(salary, calculateTenPercent));
console.log(salary.calculateTax(calculateTenPercent));

let arr = [3000, 4000, 5000];
let res = arr.calculateTax(calculateTwentyPercent);
console.log(res);

// Array.map(() => {});
