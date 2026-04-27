import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 p-8 rounded-full border border-white/5"
      >
        <ShoppingCart size={64} className="text-slate-500" />
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <p className="text-slate-400">Looks like you haven't added anything to your cart yet.</p>
      </div>
      <button className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-primary-900/20">
        Start Shopping
      </button>
    </div>
  );
};

export default Cart;
