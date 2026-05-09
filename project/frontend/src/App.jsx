import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";

// Layouts
import Navbar from "./components/Navbar";
import AdminLayout from "./admin/AdminLayout";

// User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Categories from "./pages/Categories";

// Admin pages
import Dashboard from "./admin/pages/Dashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* ── Admin routes — no Navbar, own layout ── */}
        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index          element={<Dashboard />} />
            <Route path="users"    element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders"   element={<AdminOrders />} />
          </Route>

          {/* ── User routes — with Navbar ── */}
          <Route
            path="/*"
            element={
              <SearchProvider>
                <div className="min-h-screen bg-white text-black font-sans">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/"         element={<Home />} />
                      <Route path="/login"    element={<Login />} />
                      <Route path="/signup"   element={<Signup />} />
                      <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
                      <Route path="/cart"       element={<Cart />} />
                      <Route path="/checkout"   element={<PrivateRoute><Checkout /></PrivateRoute>} />
                      <Route path="/orders"     element={<PrivateRoute><Orders /></PrivateRoute>} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/:category" element={<Categories />} />
                      <Route path="*"         element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </SearchProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
