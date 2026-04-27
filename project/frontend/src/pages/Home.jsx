import { useState, useEffect } from "react";
import api from "../utils/api";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/v1");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  //const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "CALVIN KLEIN"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-0 -mt-8">
      {/* Hero Section */}
      <section className="bg-gray-100 pt-12 pb-0 md:pt-20">
        <div className="container mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl py-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter"
            >
              FIND THE PERFECT PRODUCTS FOR YOUR LIFESTYLE
            </motion.h1>
            <p className="text-gray-600 text-lg">
              Explore our curated selection of premium products, from luxury beauty essentials to high-end tech and modern lifestyle accessories.
            </p>
            <button className="btn-black w-full md:w-auto px-16 py-4 text-lg">
              Shop Now
            </button>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <h3 className="text-3xl font-bold font-sans">500+</h3>
                <p className="text-gray-500 text-sm uppercase tracking-tight">Premium Brands</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold font-sans">5,000+</h3>
                <p className="text-gray-500 text-sm uppercase tracking-tight">Curated Products</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-3xl font-bold font-sans">50,000+</h3>
                <p className="text-gray-500 text-sm uppercase tracking-tight">Happy Customers</p>
              </div>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[600px] flex items-end">
            <img 
              src="/hero.png" 
              alt="E-commerce Hero" 
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Brand Bar */}
      <section id="brands" className="bg-black py-8 overflow-hidden">
        <div className="container mx-auto px-8 md:px-16 flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-70">
          {["APPLE", "DYSON", "AESOP", "BOSE", "SAMSUNG"].map(brand => (
            <span key={brand} className="text-white text-2xl md:text-3xl font-black tracking-widest font-integral italic">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Product Sections */}
      <section className="container mx-auto px-8 md:px-16 py-16 md:py-24 space-y-32">
        {/* New Arrivals */}
        <div id="new-arrivals" className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">New Arrivals</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <Link to="/#all-products" className="border-2 border-gray-100 px-12 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all">
              VIEW ALL
            </Link>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* On Sale */}
        <div id="on-sale" className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">On Sale</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {products.slice(5, 10).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link to="/#all-products" className="border-2 border-gray-100 px-12 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all">
              VIEW ALL
            </Link>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* All Products */}
        <div id="all-products" className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Our Full Collection</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="group space-y-4 flex flex-col h-full bg-white rounded-[20px]"
  >
    <div className="aspect-[4/5] bg-gray-100 rounded-[20px] overflow-hidden relative shadow-sm shrink-0">
      <img 
        src={product.image} 
        alt={product.name} 
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
        <h3 className="font-bold text-sm leading-tight line-clamp-1 uppercase tracking-tight text-gray-900 group-hover:text-black transition-colors">
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

      <button className="w-full bg-black text-white py-3 rounded-full font-bold text-[10px] tracking-widest uppercase hover:bg-black/90 transition-all flex items-center justify-center space-x-2 mt-auto">
        <ShoppingCart size={14} />
        <span>ADD TO CART</span>
      </button>
    </div>
  </motion.div>
);

export default Home;
