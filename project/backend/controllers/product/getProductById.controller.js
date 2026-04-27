import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});
