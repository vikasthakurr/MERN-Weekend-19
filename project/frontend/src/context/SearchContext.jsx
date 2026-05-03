import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../utils/api";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debounceRef = useRef(null);
  // Keep a ref so the debounced callback always sees the latest allProducts
  // without needing it as a useCallback dependency
  const allProductsRef = useRef([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products/v1");
        const data = res.data.data ?? [];
        allProductsRef.current = data;
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setIsSearching(false);
      setResults([]);
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      const q = value.trim().toLowerCase();
      const filtered = allProductsRef.current.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
      setResults(filtered);
    }, 400);
  }, []); // stable — reads allProductsRef.current at call time

  const clearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery("");
    setResults([]);
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{ query, results, allProducts, loading, isSearching, handleQueryChange, clearSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchProvider>");
  return ctx;
};
