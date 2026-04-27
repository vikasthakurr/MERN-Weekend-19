import express from "express";
import { getAllUsers } from "../controllers/user/getAllUsers.controller.js";
import { updateUser } from "../controllers/user/updateUser.controller.js";
import { deleteUser } from "../controllers/user/deleteUser.controller.js";
import { getAllUsersLimiter, updateProfileLimiter, deleteProfileLimiter } from "../config/rateLimit.config.js";
import verificationToken from "../middleware/verifyToken.middle.js";
import isAdmin from "../middleware/isAdmin.middle.js";

const usersRouter = express.Router();

usersRouter.get("/allusers", verificationToken, getAllUsersLimiter, getAllUsers);
usersRouter.put("/update", verificationToken, updateProfileLimiter, updateUser);
usersRouter.delete("/delete", verificationToken, deleteProfileLimiter, deleteUser);

export default usersRouter;
