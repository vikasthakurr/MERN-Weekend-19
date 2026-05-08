import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

// Keys used in localStorage
const USER_KEY  = "user";
const TOKEN_KEY = "token";

// Safe JSON parse — returns null on failure
const parseUser = (raw) => {
  try { return raw ? JSON.parse(raw) : null; }
  catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => parseUser(localStorage.getItem(USER_KEY)));

  // Call this after a successful login API response
  const login = useCallback((userData, token) => {
    localStorage.setItem(USER_KEY,  JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  }, []);

  // Clears everything — user data, token, and any other app keys
  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Update user fields (username, email, avatar, etc.) and persist to localStorage
  // Pass `persist: false` to skip localStorage (e.g. after API already confirmed)
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
