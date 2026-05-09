import Razorpay from "razorpay";
import crypto from "crypto";

// Lazily create the Razorpay instance so env vars are guaranteed to be loaded
const getRazorpay = () =>
  new Razorpay({
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
  // Razorpay works in subunits (paise). Minimum order is 100 paise (₹1).
  const amountInPaise = Math.round(amount * 100);
  if (amountInPaise < 100) {
    throw new Error(`Amount too small: ${amountInPaise} paise. Minimum is 100 paise.`);
  }

  const options = {
    amount: amountInPaise,
    currency,
    receipt,
  };

  try {
    const order = await getRazorpay().orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to create Razorpay order: ${error?.error?.description ?? error?.message ?? JSON.stringify(error)}`);
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