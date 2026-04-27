import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});
