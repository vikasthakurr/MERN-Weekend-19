import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/errorHandler.utils.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { sendEmail } from "../../utils/email.utils.js";

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Handle Avatar Upload
  let avatarUrl = "https://images.pexels.com/photos/17203241/pexels-photo-17203241.jpeg";
  let avatarPublicId = "";

  // If a file is uploaded, use it. Otherwise, use the hardcoded URL.
  const sourceToUpload = req.file ? req.file.path : avatarUrl;

  console.log("Source for Cloudinary:", sourceToUpload);

  const cloudinaryResponse = await uploadOnCloudinary(sourceToUpload);
  console.log("Cloudinary response:", cloudinaryResponse);

  if (cloudinaryResponse) {
    avatarUrl = cloudinaryResponse.secure_url;
    avatarPublicId = cloudinaryResponse.public_id;
  } else {
    console.error("Cloudinary upload failed - check your credentials in .env");
    // Fallback to the hardcoded URL if Cloudinary fails
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
    avatar: avatarUrl || undefined, // use default from schema if not provided
    avatarPublicId,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // Send Welcome Email
  try {
    await sendEmail({
      email: createdUser.email,
      subject: "Welcome to MERN Weekend 19!",
      message: `Hi ${createdUser.username}, welcome to our platform!`,
      html: `<h1>Welcome, ${createdUser.username}!</h1><p>We are glad to have you on board.</p>`,
    });
  } catch (emailError) {
    console.error("Welcome email failed to send:", emailError);
    // We don't throw an error here to avoid breaking the registration flow
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser,
  });
});
