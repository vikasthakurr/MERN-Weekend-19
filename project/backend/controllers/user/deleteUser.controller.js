import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});
