import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, Truck, CheckCircle, Loader2 } from "lucide-react";
import api from "../utils/api";

// ── Step indicators ──────────────────────────────────────────────────────────
const STEPS = ["Shipping", "Payment", "Review"];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-12">
    {STEPS.map((label, i) => (
      <div key={label} className="flex items-center">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors
              ${i <= current ? "bg-black text-white" : "bg-gray-200 text-gray-400"}`}
          >
            {i < current ? <CheckCircle size={16} /> : i + 1}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${i <= current ? "text-black" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`w-20 h-0.5 mb-5 mx-1 transition-colors ${i < current ? "bg-black" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
  </div>
);

// ── Field component ──────────────────────────────────────────────────────────
const Field = ({ label, type = "text", value, onChange, placeholder, required }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-gray-100 rounded-2xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400"
    />
  </div>
);

// ── Luhn algorithm — validates card number checksum ─────────────────────────
const luhn = (num) => {
  const digits = num.replace(/\s/g, "");
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

// ── Expiry validation — MM/YY must be in the future ──────────────────────────
const validExpiry = (val) => {
  if (val.length !== 5) return false;
  const [mm, yy] = val.split("/").map(Number);
  if (!mm || mm < 1 || mm > 12) return false;
  const now = new Date();
  const exp = new Date(2000 + yy, mm - 1, 1);
  return exp > now;
};
const ShippingStep = ({ data, onChange, onNext }) => {
  const handle = (field) => (val) => onChange({ ...data, [field]: val });

  const valid = data.fullName && data.email && data.address && data.city && data.zip && data.country;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onNext(); }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <Truck size={20} />
        <h2 className="text-lg font-black uppercase tracking-tight">Shipping Details</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name"    value={data.fullName} onChange={handle("fullName")} placeholder="John Doe"          required />
        <Field label="Email"        type="email" value={data.email} onChange={handle("email")} placeholder="john@example.com" required />
      </div>
      <Field label="Address"        value={data.address}  onChange={handle("address")}  placeholder="123 Main Street"   required />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="City"         value={data.city}     onChange={handle("city")}     placeholder="New York"          required />
        <Field label="ZIP / Postal" value={data.zip}      onChange={handle("zip")}      placeholder="10001"             required />
        <Field label="Country"      value={data.country}  onChange={handle("country")}  placeholder="United States"     required />
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
      >
        Continue to Payment
      </button>
    </form>
  );
};

// ── Step 1 — Payment ─────────────────────────────────────────────────────────
const PaymentStep = ({ data, onChange, onNext, onBack }) => {
  const handle = (field) => (val) => onChange({ ...data, [field]: val });

  // Basic card number formatter — adds spaces every 4 digits
  const handleCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    handle("cardNumber")(formatted);
  };

  const handleExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    handle("expiry")(formatted);
  };

  // Bug fix: Luhn + expiry validation instead of length-only check
  const cardDigits = data.cardNumber?.replace(/\s/g, "") ?? "";
  const valid =
    data.nameOnCard?.trim() &&
    cardDigits.length === 16 &&
    luhn(cardDigits) &&
    validExpiry(data.expiry ?? "") &&
    data.cvv?.length >= 3;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (valid) onNext(); }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <CreditCard size={20} />
        <h2 className="text-lg font-black uppercase tracking-tight">Payment Details</h2>
      </div>

      <Field label="Name on Card"  value={data.nameOnCard  ?? ""} onChange={handle("nameOnCard")}  placeholder="John Doe"    required />
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Card Number</label>
        <input
          type="text"
          value={data.cardNumber ?? ""}
          onChange={(e) => handleCard(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
          className="w-full bg-gray-100 rounded-2xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400 tracking-widest"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Expiry</label>
          <input
            type="text"
            value={data.expiry ?? ""}
            onChange={(e) => handleExpiry(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            required
            className="w-full bg-gray-100 rounded-2xl py-3.5 px-4 text-sm outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400"
          />
        </div>
        <Field label="CVV" type="password" value={data.cvv ?? ""} onChange={handle("cvv")} placeholder="•••" required />
      </div>

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onBack}
          className="flex-1 border-2 border-gray-200 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all">
          Back
        </button>
        <button type="submit" disabled={!valid}
          className="flex-[2] bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          Review Order
        </button>
      </div>
    </form>
  );
};

// ── Step 2 — Review ──────────────────────────────────────────────────────────
const ReviewStep = ({ shipping, items, total, onBack, onConfirm }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await onConfirm(); // async — calls API
    } catch (err) {
      setError(err.message ?? "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black uppercase tracking-tight">Review Your Order</h2>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3">
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-200 shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="font-bold text-xs uppercase tracking-tight line-clamp-1">{item.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">Qty: {item.quantity}</p>
            </div>
            <span className="font-black text-sm shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Shipping summary */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-1 text-sm">
        <p className="font-bold uppercase tracking-wider text-xs text-gray-500 mb-2">Ship to</p>
        <p className="font-bold">{shipping.fullName}</p>
        <p className="text-gray-600">{shipping.address}, {shipping.city} {shipping.zip}</p>
        <p className="text-gray-600">{shipping.country}</p>
        <p className="text-gray-600">{shipping.email}</p>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-black border-t border-gray-100 pt-4">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border-2 border-gray-200 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="flex-[2] bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Placing Order…
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

// ── Success screen ───────────────────────────────────────────────────────────
const OrderSuccess = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 space-y-6 text-center"
  >
    <div className="bg-green-50 p-8 rounded-full">
      <CheckCircle size={64} className="text-green-500" />
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-black uppercase tracking-tighter">Order Placed!</h2>
      <p className="text-gray-500">Thanks for your purchase. We'll send a confirmation to your email.</p>
    </div>
    <Link to="/" className="bg-black text-white px-12 py-4 rounded-full font-bold hover:bg-black/90 transition-all">
      Continue Shopping
    </Link>
  </motion.div>
);

// ── Main Checkout ────────────────────────────────────────────────────────────
const Checkout = () => {
  const items  = useSelector(selectCartItems);
  const total  = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  // Load Razorpay checkout script once
  useEffect(() => {
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const [shipping, setShipping] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    address: "123 Main Street",
    city: "New York",
    zip: "10001",
    country: "United States",
  });
  const [payment, setPayment] = useState({
    nameOnCard: "John Doe",
    cardNumber: "4532 0151 1283 0366", // valid Luhn test card
    expiry: "12/26",
    cvv: "123",
  });

  // Guard — redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-xl font-black uppercase">Your cart is empty</p>
        <Link to="/" className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-black/90 transition-all">
          Shop Now
        </Link>
      </div>
    );
  }

  // Called by ReviewStep — creates order → opens Razorpay modal → verifies payment
  const handleConfirm = () =>
    new Promise(async (resolve, reject) => {
      try {
        // Step 1: Create pending order + get Razorpay order details
        const payload = {
          items: items.map(({ _id, name, price, quantity }) => ({ name, price, quantity, productId: _id })),
          totalAmount: total,
          shippingAddress: shipping,
        };
        const { data: createRes } = await api.post("/orders/v1/create", payload);
        const { razorpayOrderId, amount, currency, keyId } = createRes.data;

        // Step 2: Open Razorpay checkout modal
        const options = {
          key: keyId,
          amount,
          currency,
          name: "SHOP.CO",
          description: "Order Payment",
          order_id: razorpayOrderId,
          prefill: {
            name: shipping.fullName,
            email: shipping.email,
          },
          theme: { color: "#000000" },

          // Step 3: On payment success — verify signature with backend
          handler: async (response) => {
            try {
              const { data: verifyRes } = await api.post("/orders/v1/verify-payment", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              dispatch(clearCart());
              navigate("/orders", { state: { newOrder: verifyRes.data } });
              resolve();
            } catch (err) {
              reject(new Error(err?.response?.data?.message ?? "Payment verification failed"));
            }
          },

          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          reject(new Error(response.error?.description ?? "Payment failed"));
        });
        rzp.open();
      } catch (err) {
        reject(new Error(err?.response?.data?.message ?? err.message ?? "Failed to initiate payment"));
      }
    });

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      {/* Back to cart */}
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8">
        <ChevronLeft size={16} />
        Back to Cart
      </Link>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-10">Checkout</h1>

      <StepBar current={step} />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {step === 0 && (
          <ShippingStep data={shipping} onChange={setShipping} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <PaymentStep data={payment} onChange={setPayment} onNext={() => setStep(2)} onBack={() => setStep(0)} />
        )}
        {step === 2 && (
          <ReviewStep shipping={shipping} items={items} total={total} onBack={() => setStep(1)} onConfirm={handleConfirm} />
        )}
      </motion.div>
    </div>
  );
};

export default Checkout;
