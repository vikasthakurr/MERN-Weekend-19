import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { redisClient } from "../../config/redis.config.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "Name, description, price, and category are required");
  }

  let imageUrl = undefined;
  let imagePublicId = undefined;

  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResponse) {
      imageUrl = cloudinaryResponse.secure_url;
      imagePublicId = cloudinaryResponse.public_id;
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock: stock || 0,
    image: imageUrl,
    imagePublicId,
  });

  // Invalidate Cache
  try {
    if (redisClient.isOpen) {
      await redisClient.del("products:all");
      console.log("Cache invalidated: products:all");
    }
  } catch (cacheError) {
    console.error("Redis del error:", cacheError.message);
  }

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});
