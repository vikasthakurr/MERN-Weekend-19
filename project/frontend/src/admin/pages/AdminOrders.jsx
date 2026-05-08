import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const AdminOrders = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter">Orders</h1>
      <p className="text-gray-500 text-sm mt-1">Order management coming soon</p>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[20px] border border-gray-100 flex flex-col items-center justify-center py-24 gap-4"
    >
      <div className="bg-gray-100 p-6 rounded-full">
        <ShoppingBag size={40} className="text-gray-400" />
      </div>
      <p className="text-gray-500 text-sm font-medium">No orders yet</p>
    </motion.div>
  </div>
);

export default AdminOrders;
