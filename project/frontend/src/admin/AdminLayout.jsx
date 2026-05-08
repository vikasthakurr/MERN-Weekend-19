import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin",          label: "Dashboard",  icon: LayoutDashboard, end: true },
  { to: "/admin/users",    label: "Users",       icon: Users },
  { to: "/admin/products", label: "Products",    icon: Package },
  { to: "/admin/orders",   label: "Orders",      icon: ShoppingBag },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-gray-100">
        <p className="text-xl font-black tracking-tighter">SHOP.CO</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-widest">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-grow px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
               ${isActive
                 ? "bg-black text-white"
                 : "text-gray-500 hover:bg-gray-100 hover:text-black"}`
            }
          >
            <Icon size={18} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
            {user?.username?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{user?.username}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-white h-full z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 gap-4 sticky top-0 z-20">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Admin</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
