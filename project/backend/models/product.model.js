import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      default: 0,
    },
    image: {
      type: String, // Cloudinary URL
      default: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
    },
    imagePublicId: {
      type: String, // Cloudinary Public ID for deletion
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
