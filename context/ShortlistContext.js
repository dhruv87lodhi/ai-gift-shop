"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ShortlistContext = createContext();

export function ShortlistProvider({ children }) {
  const [shortlist, setShortlist] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("shortlist");
    if (saved) {
      try {
        setShortlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse shortlist");
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("shortlist", JSON.stringify(shortlist));
  }, [shortlist]);

  const toggleShortlist = (product) => {
    setShortlist((prev) => {
      const isAlreadyShortlisted = prev.some((item) => item.id === product.id);
      if (isAlreadyShortlisted) {
        // Remove from shortlist
        return prev.filter((item) => item.id !== product.id);
      } else {
        // Add to shortlist
        return [...prev, product];
      }
    });
  };

  const isShortlisted = (productId) => {
    return shortlist.some((item) => item.id === productId);
  };

  return (
    <ShortlistContext.Provider value={{ shortlist, toggleShortlist, isShortlisted }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  return useContext(ShortlistContext);
}
