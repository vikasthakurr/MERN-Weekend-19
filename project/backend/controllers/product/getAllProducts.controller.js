import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import { redisClient } from "../../config/redis.config.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, sort } = req.query;
  const isFiltered = category || minPrice || maxPrice || sort;

  // ── Unfiltered request — try Redis cache ──────────────────────────────
  if (!isFiltered) {
    const cacheKey = "products:all";
    try {
      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log("Cache hit: products:all");
          return res.status(200).json({
            success: true,
            message: "Products fetched successfully (from cache)",
            data: JSON.parse(cached),
          });
        }
      }
    } catch (cacheError) {
      console.error("Redis get error:", cacheError.message);
    }

    const products = await Product.find();
    console.log("Cache miss: products:all");

    try {
      if (redisClient.isOpen) {
        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });
      }
    } catch (cacheError) {
      console.error("Redis set error:", cacheError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  // ── Filtered request — skip cache, build query ────────────────────────
  const filter = {};

  if (category && category !== "all") {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  // Sort mapping
  const sortMap = {
    newest:     { createdAt: -1 },
    oldest:     { createdAt:  1 },
    "price-asc":  { price:  1 },
    "price-desc": { price: -1 },
    popular:    { rating: -1 },   // rating field if present, else falls back to natural order
  };
  const sortQuery = sortMap[sort] ?? { createdAt: -1 };

  const products = await Product.find(filter).sort(sortQuery);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});
