import asyncHandler from "../utils/asyncHandler.utils.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/errorHandler.utils.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/payment.service.js";
import { sendEmail } from "../utils/email.utils.js";

// Create Order
export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "No items in order");
  }

  // Skip Razorpay for now — mark payment as completed directly
  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress,
    paymentStatus: "completed",
    orderStatus: "processing",
  });

  // Send confirmation email (non-blocking)
  try {
    await sendEmail({
      email: req.user.email,
      subject: "Order Confirmed — SHOP.CO",
      message: `Your order #${order._id} for $${totalAmount} has been placed successfully.`,
      html: `<h2>Order Confirmed!</h2><p>Your order <strong>#${order._id}</strong> for <strong>$${totalAmount}</strong> has been placed and is being processed.</p>`,
    });
  } catch (emailError) {
    console.error("Order confirmation email failed:", emailError);
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

// Get All Orders (Admin only)
export const getAllOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to access all orders");
  }

  const orders = await Order.find().populate("user", "username email");

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// Get User Orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// Get Order By ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "username email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to view this order");
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// Update Order Status (Admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to update order status");
  }

  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { orderStatus, paymentStatus } },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});

// Delete Order (Admin only)
export const deleteOrder = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to delete orders");
  }

  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// Verify Payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const isVerified = verifyRazorpayPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!isVerified) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // Update order status in DB
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpayOrderId },
    {
      $set: {
        paymentStatus: "completed",
        razorpayPaymentId: razorpayPaymentId,
      },
    },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Send Payment Success Email
  try {
    await sendEmail({
      email: req.user.email,
      subject: "Payment Successful - Order Confirmed",
      message: `Your payment for order ${order._id} was successful. We are now processing your order.`,
      html: `<h2>Payment Received!</h2><p>Thank you for your payment. Your order <strong>#${order._id}</strong> is now confirmed and being processed.</p>`,
    });
  } catch (emailError) {
    console.error("Payment confirmation email failed:", emailError);
  }

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: order,
  });
});
