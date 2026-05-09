import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Plus, Minus, SlidersHorizontal, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease, selectItemInCart } from "../store/cartSlice";
import { useSearch } from "../context/SearchContext";
import FilterSidebar from "../components/FilterSidebar";
import api from "../utils/api";

const DEFAULT_FILTERS = {
  category: "all",
  priceRange: [0, 1000],
  minRating: null,
  sort: "newest",
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="space-y-4 flex flex-col rounded-[20px] animate-pulse">
    <div className="aspect-[4/5] bg-gray-200 rounded-[20px]" />
    <div className="space-y-2 px-1">
      <div className="h-3 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      <div className="h-10 bg-gray-200 rounded-full mt-2" />
    </div>
  </div>
);

// ── Product card (same style as Home) ────────────────────────────────────────
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectItemInCart(product._id));
  const rating = product.rating ?? 4;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group space-y-4 flex flex-col h-full bg-white rounded-[20px]"
    >
      <div className="aspect-[4/5] bg-gray-100 rounded-[20px] overflow-hidden relative shadow-sm shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {product.price > 100 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>

      <div className="px-1 space-y-3 flex-grow flex flex-col">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 capitalize">{product.category}</p>
          <h3 className="font-bold text-sm leading-tight line-clamp-1 uppercase tracking-tight">{product.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.round(rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400">{rating}/5</span>
          </div>
          <span className="text-lg font-black tracking-tighter">${product.price}</span>
        </div>

        {cartItem ? (
          <div className="flex items-center justify-between bg-black rounded-full px-2 py-1 mt-auto">
            <button onClick={() => dispatch(decrease(product._id))} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors">
              <Minus size={14} />
            </button>
            <span className="text-white font-bold text-sm">{cartItem.quantity}</span>
            <button onClick={() => dispatch(increase(product._id))} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors">
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => dispatch(addToCart(product))}
            className="w-full bg-black text-white py-3 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-black/90 transition-all flex items-center justify-center gap-2 mt-auto"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ── Category pill nav ─────────────────────────────────────────────────────────
const CategoryPills = ({ categories, active, onSelect }) => (
  <div className="flex gap-2 flex-wrap">
    {["all", ...categories].map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all
          ${active === cat ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
      >
        {cat === "all" ? "All" : cat}
      </button>
    ))}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const Categories = () => {
  const { category: urlCategory } = useParams();   // /categories/:category
  const navigate = useNavigate();
  const { allProducts } = useSearch();             // already fetched by SearchContext

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: urlCategory ?? "all",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Derive unique categories from allProducts
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort();
    return cats;
  }, [allProducts]);

  // Sync URL param → filter
  useEffect(() => {
    if (urlCategory) setFilters((f) => ({ ...f, category: urlCategory }));
  }, [urlCategory]);

  // Fetch from backend whenever filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category !== "all") params.set("category", filters.category);
        if (filters.priceRange[0] > 0)    params.set("minPrice", filters.priceRange[0]);
        if (filters.priceRange[1] < 1000) params.set("maxPrice", filters.priceRange[1]);
        if (filters.sort)                 params.set("sort", filters.sort);

        const { data } = await api.get(`/products/v1?${params.toString()}`);
        let result = data.data ?? [];

        // Client-side rating filter (not in backend schema yet)
        if (filters.minRating) {
          result = result.filter((p) => (p.rating ?? 4) >= filters.minRating);
        }

        setProducts(result);
      } catch (err) {
        console.error("Failed to fetch filtered products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [filters]);

  const handleFilterChange = useCallback((patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    navigate("/categories");
  }, [navigate]);

  const handleCategorySelect = useCallback((cat) => {
    setFilters((f) => ({ ...f, category: cat }));
    navigate(cat === "all" ? "/categories" : `/categories/${cat}`);
  }, [navigate]);

  return (
    <div className="container mx-auto px-8 md:px-16 py-12 space-y-8">

      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Browse Categories</h1>
        <p className="text-gray-500">
          {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}`}
          {filters.category !== "all" && (
            <span className="ml-2 font-bold capitalize text-black">in {filters.category}</span>
          )}
        </p>
      </div>

      {/* Category pills */}
      <CategoryPills categories={categories} active={filters.category} onSelect={handleCategorySelect} />

      <div className="flex gap-10 items-start">

        {/* ── Desktop sidebar ── */}
        <div className="hidden lg:block w-56 shrink-0 sticky top-24">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* ── Product grid ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 border-2 border-gray-200 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-all"
            >
              <SlidersHorizontal size={16} /> Filters & Sort
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
              <p className="text-5xl">🛍️</p>
              <p className="text-xl font-black uppercase tracking-tight">No products found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              <button onClick={handleReset} className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-black/90 transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              <AnimatePresence mode="popLayout">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-black text-lg uppercase tracking-tight">Filters</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar
                categories={categories}
                filters={filters}
                onChange={(patch) => { handleFilterChange(patch); }}
                onReset={() => { handleReset(); setSidebarOpen(false); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
