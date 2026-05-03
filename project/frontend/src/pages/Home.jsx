import { useEffect, useRef, useState, useCallback } from "react";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease, selectItemInCart } from "../store/cartSlice";
import { useSearch } from "../context/SearchContext";

// ── Intersection observer hook ───────────────────────────────────────────────
// Returns [ref, hasBeenVisible] — once visible, stays true forever
const useReveal = (options = {}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // fire once
        }
      },
      { rootMargin: "100px", threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

// ── Skeleton card ────────────────────────────────────────────────────────────
const ProductCardSkeleton = () => (
  <div className="space-y-4 flex flex-col h-full rounded-[20px] animate-pulse">
    <div className="aspect-[4/5] bg-gray-200 rounded-[20px]" />
    <div className="px-1 space-y-3">
      <div className="h-3 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      <div className="h-3 bg-gray-200 rounded-full w-1/3" />
      <div className="h-10 bg-gray-200 rounded-full mt-2" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 5 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// ── Lazy section wrapper ─────────────────────────────────────────────────────
// Shows skeletons until the section scrolls into view, then renders children
const LazySection = ({ id, title, skeletonCount = 5, children }) => {
  const [ref, visible] = useReveal();

  return (
    <div id={id} className="space-y-16" ref={ref}>
      <SectionHeader title={title} />
      {visible ? children : <SkeletonGrid count={skeletonCount} />}
    </div>
  );
};

// ── Home ─────────────────────────────────────────────────────────────────────
const BATCH = 10;

const Home = () => {
  const { hash } = useLocation();
  const { allProducts, results, loading, isSearching } = useSearch();

  // "Full Collection" infinite scroll state
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const sentinelRef = useRef(null);

  // Reset pagination when allProducts changes (fresh load)
  useEffect(() => { setVisibleCount(BATCH); }, [allProducts]);

  // Scroll to hash anchor
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  // Sentinel observer — load next batch when bottom of collection is reached
  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + BATCH, allProducts.length));
  }, [allProducts.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // ── Initial full-page skeleton (first load) ────────────────────────────
  if (loading && allProducts.length === 0) {
    return (
      <div className="space-y-0 -mt-8">
        {/* Hero skeleton */}
        <section className="bg-gray-100 pt-12 pb-0 md:pt-20">
          <div className="container mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 py-8 animate-pulse">
              <div className="h-16 bg-gray-200 rounded-2xl w-full" />
              <div className="h-16 bg-gray-200 rounded-2xl w-5/6" />
              <div className="h-5 bg-gray-200 rounded-full w-3/4" />
              <div className="h-14 bg-gray-200 rounded-full w-48" />
            </div>
            <div className="h-[400px] md:h-[600px] bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </section>
        <section className="container mx-auto px-8 md:px-16 py-16 space-y-16">
          <div className="h-10 bg-gray-200 rounded-full w-48 mx-auto animate-pulse" />
          <SkeletonGrid count={5} />
        </section>
      </div>
    );
  }

  // ── Search results view ────────────────────────────────────────────────
  if (isSearching) {
    return (
      <div className="container mx-auto px-8 md:px-16 py-16 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Search Results</h2>
          {loading ? (
            <span className="text-sm text-gray-400 animate-pulse">Searching…</span>
          ) : (
            <span className="text-sm text-gray-500 font-medium">
              {results.length} product{results.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {!loading && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
            <p className="text-5xl">🔍</p>
            <p className="text-xl font-black uppercase tracking-tight">No products found</p>
            <p className="text-gray-500 text-sm">Try a different keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {results.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    );
  }

  // ── Default homepage ───────────────────────────────────────────────────
  const collectionSlice = allProducts.slice(0, visibleCount);
  const hasMore = visibleCount < allProducts.length;

  return (
    <div className="space-y-0 -mt-8">
      {/* Hero — above the fold, no lazy load */}
      <section className="bg-gray-100 pt-12 pb-0 md:pt-20">
        <div className="container mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl py-8">
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter animate-fadein">
              FIND THE PERFECT PRODUCTS FOR YOUR LIFESTYLE
            </h1>
            <p className="text-gray-600 text-lg">
              Explore our curated selection of premium products, from luxury beauty
              essentials to high-end tech and modern lifestyle accessories.
            </p>
            <Link
              to="/#all-products"
              className="inline-block bg-black text-white w-full md:w-auto text-center px-16 py-4 text-lg font-bold rounded-full hover:bg-black/90 transition-all"
            >
              Shop Now
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="text-gray-500 text-sm uppercase tracking-tight">Premium Brands</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">5,000+</h3>
                <p className="text-gray-500 text-sm uppercase tracking-tight">Curated Products</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-3xl font-bold">50,000+</h3>
                <p className="text-gray-500 text-sm uppercase tracking-tight">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[400px] md:h-[600px]">
            <img
              src="/hero.png"
              alt="Hero"
              width={600}
              height={600}
              fetchPriority="high"
              decoding="sync"
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Brand Bar */}
      <section id="brands" className="bg-black py-8 overflow-hidden">
        <div className="container mx-auto px-8 md:px-16 flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-70">
          {["APPLE", "DYSON", "AESOP", "BOSE", "SAMSUNG"].map((brand) => (
            <span key={brand} className="text-white text-2xl md:text-3xl font-black tracking-widest italic">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Product Sections */}
      <section className="container mx-auto px-8 md:px-16 py-16 md:py-24 space-y-32">

        {/* New Arrivals — lazy */}
        <LazySection id="new-arrivals" title="New Arrivals" skeletonCount={5}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {allProducts.slice(0, 5).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <ViewAllBtn />
        </LazySection>

        <hr className="border-gray-100" />

        {/* On Sale — lazy */}
        <LazySection id="on-sale" title="On Sale" skeletonCount={5}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {allProducts.slice(5, 10).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <ViewAllBtn />
        </LazySection>

        <hr className="border-gray-100" />

        {/* Full Collection — lazy + infinite scroll */}
        <LazySection id="all-products" title="Our Full Collection" skeletonCount={10}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {collectionSlice.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          {/* Sentinel — triggers next batch */}
          {hasMore && (
            <div ref={sentinelRef} className="pt-10">
              <SkeletonGrid count={5} />
            </div>
          )}

          {!hasMore && allProducts.length > 0 && (
            <p className="text-center text-gray-400 text-sm font-medium pt-8 uppercase tracking-widest">
              You've seen it all
            </p>
          )}
        </LazySection>

      </section>
    </div>
  );
};

// ── Shared sub-components ────────────────────────────────────────────────────

const SectionHeader = ({ title }) => (
  <div className="text-center space-y-4">
    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{title}</h2>
    <div className="w-24 h-1 bg-black mx-auto rounded-full" />
  </div>
);

const ViewAllBtn = () => (
  <div className="flex justify-center pt-4">
    <Link
      to="/#all-products"
      className="border-2 border-gray-100 px-12 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all"
    >
      VIEW ALL
    </Link>
  </div>
);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectItemInCart(product._id));

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group space-y-4 flex flex-col h-full bg-white rounded-[20px]"
    >
      <div className="aspect-[4/5] bg-gray-100 rounded-[20px] overflow-hidden relative shadow-sm shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
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
          <h3 className="font-bold text-sm leading-tight line-clamp-1 uppercase tracking-tight text-gray-900">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">4.5/5</span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-lg font-black tracking-tighter">${product.price}</span>
            {product.price > 100 && (
              <span className="text-sm font-bold text-gray-300 line-through tracking-tighter">
                ${Math.round(product.price * 1.3)}
              </span>
            )}
          </div>
        </div>

        {cartItem ? (
          <div className="flex items-center justify-between bg-black rounded-full px-2 py-1 mt-auto">
            <button
              onClick={() => dispatch(decrease(product._id))}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-white font-bold text-sm">{cartItem.quantity}</span>
            <button
              onClick={() => dispatch(increase(product._id))}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => dispatch(addToCart(product))}
            className="w-full bg-black text-white py-3 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-black/90 transition-all flex items-center justify-center space-x-2 mt-auto"
          >
            <ShoppingCart size={14} />
            <span>ADD TO CART</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
