import express from "express";
import { createProduct } from "../controllers/product/createProduct.controller.js";
import { getAllProducts } from "../controllers/product/getAllProducts.controller.js";
import { getProductById } from "../controllers/product/getProductById.controller.js";
import { updateProduct } from "../controllers/product/updateProduct.controller.js";
import { deleteProduct } from "../controllers/product/deleteProduct.controller.js";
import verificationToken from "../middleware/verifyToken.middle.js";
import isAdmin from "../middleware/isAdmin.middle.js";
import upload from "../config/multer.config.js";

const productRouter = express.Router();

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Admin only routes
productRouter.post("/", verificationToken, isAdmin, upload.single("image"), createProduct);
productRouter.put("/:id", verificationToken, isAdmin, upload.single("image"), updateProduct);
productRouter.delete("/:id", verificationToken, isAdmin, deleteProduct);

export default productRouter;
