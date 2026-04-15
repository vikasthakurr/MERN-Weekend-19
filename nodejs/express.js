import express from "express";
import fs from "fs";
import ejs from "ejs";
// console.log(express);

const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use((req, res, next) => {
  console.log("middleware 1 called");
  next();
});

let username = "vikas";
let password = "1234";

app.use((req, res, next) => {
  if (req.body.username == username && req.body.password == password) {
    next();
  } else {
    res.end("invalid credentials");
  }
});

app.use((req, res, next) => {
  fs.appendFile(
    "users.txt",
    `${req.body.username} logged in at ${Date.now()}\n`,
    (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
    },
  );
  next();
});
//logic
// app.get("/", (req, res) => {
//   res.end("heello from express server");
// });

app.get("/about", (req, res, next,err) => {
  res.render("about.ejs");
});

app.get("/products", (req, res) => {
  //   fs.readFile("./product-page.html", "utf-8", (err, data) => {
  //     if (err) return res.json({ err: "something went wrong" });
  //     res.send(data);
  //   });
  res.render("index.html");
});
app.post("/login", (req, res) => {
  console.log(req.body);
  res.end("login done");
});
app.listen(3000, () => {
  console.log("server started");
});
