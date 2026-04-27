import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import { redisClient } from "../../config/redis.config.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const cacheKey = "products:all";

  // Try to get from Redis
  try {
    if (redisClient.isOpen) {
      const cachedProducts = await redisClient.get(cacheKey);
      if (cachedProducts) {
        console.log("Cache hit: products:all");
        return res.status(200).json({
          success: true,
          message: "Products fetched successfully (from cache)",
          data: JSON.parse(cachedProducts),
        });
      }
    }
  } catch (cacheError) {
    console.error("Redis get error:", cacheError.message);
  }

  // If not in cache or Redis is down, fetch from DB
  const products = await Product.find();
  console.log("Cache miss: products:all");

  // Save to Redis
  try {
    if (redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(products), {
        EX: 3600, // Expires in 1 hour
      });
    }
  } catch (cacheError) {
    console.error("Redis set error:", cacheError.message);
  }
  
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});
