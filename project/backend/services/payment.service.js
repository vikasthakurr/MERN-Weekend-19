import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

const razorpay = new Razorpay({
  key_id: process.env.PAYMENT_API_KEY,
  key_secret: process.env.PAYMENT_API_SECRET,
});

/**
 * Creates a Razorpay order.
 * @param {number} amount - Amount in basic units (e.g., 500 INR).
 * @param {string} currency - Currency code (e.g., "INR").
 * @param {string} receipt - Unique receipt ID.
 * @returns {Promise<object>} - Razorpay order object.
 */
export const createRazorpayOrder = async (amount, currency = "INR", receipt) => {
  const options = {
    amount: Math.round(amount * 100), // Razorpay works in subunits (paise for INR)
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw new Error("Failed to create Razorpay order");
  }
};

/**
 * Verifies the Razorpay payment signature.
 * @param {string} orderId - The Razorpay order ID.
 * @param {string} paymentId - The Razorpay payment ID.
 * @param {string} signature - The signature returned by Razorpay.
 * @returns {boolean} - Whether the signature is valid.
 */
export const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.PAYMENT_API_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
};