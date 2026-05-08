import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { increase, decrease, removeItem, clearCart, selectCartItems, selectCartTotal } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-100 p-8 rounded-full"
        >
          <ShoppingCart size={64} className="text-gray-400" />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black uppercase">Your Cart is Empty</h2>
          <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        </div>
        <Link
          to="/"
          className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-black/90 transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Your Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1.5"
        >
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      {/* Bug fix: AnimatePresence required for exit animations to actually run */}
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
            className="flex items-center gap-6 bg-gray-50 rounded-[20px] p-4"
          >
            {/* Image */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-bold uppercase tracking-tight text-sm line-clamp-1">
                {item.name}
              </h3>
              <p className="text-lg font-black mt-1">${item.price}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center bg-black rounded-full px-2 py-1 space-x-2">
                <button
                  onClick={() => dispatch(decrease(item._id))}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="text-white font-bold text-sm w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => dispatch(increase(item._id))}
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Subtotal */}
              <span className="font-black text-base w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => dispatch(removeItem(item._id))}
                aria-label="Remove item"
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-[24px] p-8 space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight">Order Summary</h2>
        <div className="space-y-3 text-sm font-medium">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span className="text-green-600 font-bold">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-black">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/90 transition-all"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
