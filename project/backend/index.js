import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import { connectRedis } from "./config/redis.config.js";

dotenv.config({ path: "./env/.env" });
const PORT = process.env.PORT || 3000;
connectDB();
connectRedis();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
