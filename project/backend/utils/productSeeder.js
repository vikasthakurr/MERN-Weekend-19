import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import connectDB from "../config/db.config.js";

dotenv.config({ path: "./env/.env" });

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany();
    console.log("Existing products cleared");

    // Fetch products from DummyJSON
    console.log("Fetching products from dummyjson.com...");
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) {
      throw new Error("Invalid data format from DummyJSON");
    }

    // Map DummyJSON products to our Product model
    const mappedProducts = data.products.map((p) => ({
      name: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      image: p.thumbnail, // Using thumbnail as main image
    }));

    // Insert new products
    await Product.insertMany(mappedProducts);
    console.log(`Successfully seeded ${mappedProducts.length} products from DummyJSON!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error.message);
    process.exit(1);
  }
};

seedProducts();
