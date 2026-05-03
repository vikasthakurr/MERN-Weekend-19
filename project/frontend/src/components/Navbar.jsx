import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, Search, ChevronDown, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSlice";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const { query, handleQueryChange, clearSearch } = useSearch();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-8 md:px-16 h-20 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="text-3xl font-black tracking-tighter flex-shrink-0">
          SHOP.CO
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center space-x-6 text-base whitespace-nowrap">
          <Link to="/#all-products" className="flex items-center space-x-1 hover:text-gray-600 transition-colors">
            <span>Shop</span>
            <ChevronDown size={16} />
          </Link>
          <Link to="/#on-sale"      className="hover:text-gray-600 transition-colors">On Sale</Link>
          <Link to="/#new-arrivals" className="hover:text-gray-600 transition-colors">New Arrivals</Link>
          <Link to="/#brands"       className="hover:text-gray-600 transition-colors">Brands</Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-grow max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-gray-100 border-none rounded-full py-3 pl-12 pr-10 focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Mobile search icon */}
          <button className="md:hidden"><Search size={24} /></button>

          {/* Cart */}
          <Link to="/cart" className="relative hover:scale-110 transition-transform">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black uppercase">
                  {user.username?.[0] ?? <User size={14} />}
                </div>
                <span className="hidden lg:block text-sm font-bold">
                  Welcome, {user.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <User size={24} />
              <span className="hidden lg:block text-sm font-bold">Sign In</span>
            </Link>
          )}

          <button className="lg:hidden"><Menu size={24} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
