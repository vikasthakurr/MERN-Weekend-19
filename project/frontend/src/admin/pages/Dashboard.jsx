import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import api from "../../utils/api";

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-[20px] p-6 border border-gray-100 space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <TrendingUp size={11} />
        Live
      </span>
    </div>
    <div>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
      <p className="text-sm font-bold text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes] = await Promise.allSettled([
          api.get("/users/v1/allusers"),
          api.get("/products/v1"),
        ]);

        const users    = usersRes.status    === "fulfilled" ? usersRes.value.data.data    ?? [] : [];
        const products = productsRes.status === "fulfilled" ? productsRes.value.data.data ?? [] : [];

        setStats({
          users:    users.length,
          products: products.length,
          orders:   0,   // wire up when orders API is ready
          revenue:  0,
        });
        setRecentUsers(users.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Users,       label: "Total Users",    value: loading ? "—" : stats.users,    color: "bg-blue-500",   sub: "Registered accounts",  delay: 0 },
    { icon: Package,     label: "Total Products",  value: loading ? "—" : stats.products, color: "bg-purple-500", sub: "In catalogue",          delay: 0.05 },
    { icon: ShoppingBag, label: "Total Orders",    value: loading ? "—" : stats.orders,   color: "bg-orange-500", sub: "All time",              delay: 0.1 },
    { icon: DollarSign,  label: "Revenue",         value: loading ? "—" : `$${stats.revenue.toFixed(2)}`, color: "bg-green-500", sub: "All time", delay: 0.15 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Recent users table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[20px] border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black uppercase tracking-tight text-sm">Recent Users</h2>
          <a href="/admin/users" className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1 transition-colors">
            View all <ArrowUpRight size={12} />
          </a>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentUsers.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No users yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                        {u.username?.[0]}
                      </div>
                      <span className="font-bold">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full
                      ${u.role === "admin" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
