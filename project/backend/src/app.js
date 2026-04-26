import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.routes.js";
import usersRouter from "../routes/users.routes.js";
import ordersRouter from "../routes/order.routes.js";

const app = express();

app.use(express.json()); // adding this so req.body can be read in POST requests
app.use(cookieParser());
app.use("/api/auth/v1", authRouter);
app.use("/api/users/v1", usersRouter);
app.use("/api/orders/v1", ordersRouter);

app.get("/api/health", (req, res) => {
  res.send("OK");
});

export default app;
