import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <div className="min-h-screen bg-white text-black font-sans">
            <Navbar />
            <main>
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/signup"   element={<Signup />} />
                <Route path="/profile"  element={<Profile />} />
                <Route path="/cart"     element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders"   element={<Orders />} />
              </Routes>
            </main>
          </div>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
