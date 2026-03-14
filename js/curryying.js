// function mail(to, sub, body) {
//   console.log(
//     `mail has been sent to ${to}, with subject ${sub} and body ${body}`,
//   );
// }

// mail("welcome back", "hii");

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
