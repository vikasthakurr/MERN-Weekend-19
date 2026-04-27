import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, Search, ChevronDown } from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-8 md:px-16 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter flex-shrink-0"
        >
          SHOP.CO
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 text-base whitespace-nowrap">
          <Link
            to="/#all-products"
            className="flex items-center space-x-1 hover:text-gray-600 transition-colors"
          >
            <span>Shop</span>
            <ChevronDown size={16} />
          </Link>
          <Link
            to="/#on-sale"
            className="hover:text-gray-600 transition-colors"
          >
            On Sale
          </Link>
          <Link
            to="/#new-arrivals"
            className="hover:text-gray-600 transition-colors"
          >
            New Arrivals
          </Link>
          <Link to="/#brands" className="hover:text-gray-600 transition-colors">
            Brands
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-xl relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-gray-100 border-none rounded-full py-3 pl-12 pr-4 focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="md:hidden">
            <Search size={24} />
          </button>
          <Link
            to="/cart"
            className="relative hover:scale-110 transition-transform"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="hover:scale-110 transition-transform"
              >
                <User size={24} />
              </Link>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:scale-110 transition-transform">
              <User size={24} />
            </Link>
          )}

          <button className="lg:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
