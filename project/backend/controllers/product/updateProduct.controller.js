import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { redisClient } from "../../config/redis.config.js";

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  let updateData = { ...req.body };

  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResponse) {
      updateData.image = cloudinaryResponse.secure_url;
      updateData.imagePublicId = cloudinaryResponse.public_id;
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Invalidate Cache
  try {
    if (redisClient.isOpen) {
      await redisClient.del("products:all");
      console.log("Cache invalidated: products:all");
    }
  } catch (cacheError) {
    console.error("Redis del error:", cacheError.message);
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});
