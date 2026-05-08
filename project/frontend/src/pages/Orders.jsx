import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CheckCircle, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";

const STATUS_STYLES = {
  processing: "bg-yellow-50 text-yellow-700",
  shipped:    "bg-blue-50 text-blue-700",
  delivered:  "bg-green-50 text-green-700",
  cancelled:  "bg-red-50 text-red-600",
  completed:  "bg-green-50 text-green-700",
  pending:    "bg-gray-100 text-gray-600",
  failed:     "bg-red-50 text-red-600",
};

const Badge = ({ label, type }) => (
  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${STATUS_STYLES[type] ?? "bg-gray-100 text-gray-500"}`}>
    {label}
  </span>
);

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-[20px] overflow-hidden"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
            <Package size={18} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-sm truncate">Order #{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-400 mt-0.5">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <Badge label={order.orderStatus}  type={order.orderStatus} />
          <Badge label={order.paymentStatus} type={order.paymentStatus} />
          <span className="font-black text-sm">${order.totalAmount?.toFixed(2)}</span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-6 py-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-500">
                      {item.quantity}×
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-black">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.shippingAddress && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
                  <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">Shipped to</p>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Orders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const location = useLocation();
  const newOrder = location.state?.newOrder;

  useEffect(() => {
    api.get("/orders/v1/my-orders")
      .then(({ data }) => setOrders(data.data ?? []))
      .catch((err) => setError(err.response?.data?.message ?? "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-8">
      <AnimatePresence>
        {newOrder && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-600 shrink-0" />
            <div>
              <p className="font-bold text-green-800 text-sm">Order placed successfully!</p>
              <p className="text-green-600 text-xs mt-0.5">
                Order #{newOrder._id.slice(-8).toUpperCase()} is now being processed.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
          Continue Shopping
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-[20px] animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 space-y-5"
        >
          <div className="bg-gray-100 p-8 rounded-full">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xl font-black uppercase tracking-tight">No orders yet</p>
            <p className="text-gray-500 text-sm">Your placed orders will appear here.</p>
          </div>
          <Link to="/" className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-black/90 transition-all">
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  );
};

export default Orders;
