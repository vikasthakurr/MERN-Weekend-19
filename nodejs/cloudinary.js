import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

dotenv.config();
const PORT = 3000;
const app = express();


app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Set up Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Handle file upload
app.post("/upload", upload.single("dp"), async (req, res) => {
  try {
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path);
    res.send(result);
  } catch (error) {
    fs.unlinkSync(req.file.path); // Clean up the uploaded file on error
    res.status(500).send({
      message: "An error occurred during the upload.",
      error: error.message,
    });
  }
});

// Start server
// const port = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
