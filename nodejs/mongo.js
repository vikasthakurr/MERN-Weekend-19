import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { loginLimitter } from "./rate-limit.js";

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: ["user", "admin"],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.end("hi");
});

app.post("/register", async (req, res) => {
  //   const { email, password } = req.body;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.end("user registered");
  } catch (err) {
    console.log(err);
    res.end("something went wrong");
  }
});

app.post("/login", loginLimitter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "please create a account first" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.status(401).json({ message: "invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
    });
    //send mail
    res.status(200).json({ message: "login successfull", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

//middlware to verify token

const verificationToken = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token || !token.startsWith("Bearer"))
      return res
        .status(401)
        .json({ message: "token is not availble to process" });

    const finalToken = token.split(" ")[1];

    const isVerified = jwt.verify(finalToken, process.env.SECRET_JWT);

    if (!isVerified) return res.status(401).json({ message: "unauthorized" });

    req.user = isVerified;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

app.get("/allusers", verificationToken, async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(404).json({ message: "no users found" });
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "user not found" });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, password },
      { new: true },
    );
    if (!updatedUser)
      return res.status(404).json({ message: "user not found" });
    res.status(200).json({ message: "user updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
