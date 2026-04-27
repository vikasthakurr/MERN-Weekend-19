import express from "express";
import { register } from "../controllers/auth/register.controller.js";
import { login } from "../controllers/auth/login.controller.js";
import { loginLimitter } from "../config/rateLimit.config.js";
import upload from "../config/multer.config.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), register);
authRouter.post("/login", loginLimitter, login);

export default authRouter;
