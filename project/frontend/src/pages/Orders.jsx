import { motion } from "framer-motion";
import { Package } from "lucide-react";

const Orders = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <div className="bg-primary-600/20 p-3 rounded-2xl">
          <Package className="text-primary-500" size={32} />
        </div>
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-3xl text-center space-y-4"
      >
        <p className="text-slate-400">You haven't placed any orders yet.</p>
        <button className="text-primary-400 hover:underline font-medium">
          Browse our collection
        </button>
      </motion.div>
    </div>
  );
};

export default Orders;
