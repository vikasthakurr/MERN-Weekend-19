import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import api from "../../utils/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState("");

  useEffect(() => {
    api.get("/products/v1")
      .then(({ data }) => setProducts(data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} items in catalogue</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-black/90 transition-all">
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[20px] border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0" />
                        <span className="font-bold line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-black">${p.price}</td>
                    <td className="px-6 py-3 text-gray-500 capitalize">{p.category ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProducts;
