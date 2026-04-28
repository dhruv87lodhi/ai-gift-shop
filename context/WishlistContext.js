"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Load from local storage and sync with DB
  useEffect(() => {
    if (user) {
      // Load from localStorage first for instant UI
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse wishlist", e);
        }
      }

      // Fetch from backend
      fetch("/api/wishlist")
        .then((res) => res.json())
        .then((data) => {
          if (data.wishlist) {
            setWishlist(data.wishlist);
            localStorage.setItem("wishlist", JSON.stringify(data.wishlist));
          }
        })
        .catch(err => console.error("Wishlist fetch error:", err));
    } else {
      setWishlist([]);
      localStorage.removeItem("wishlist");
    }
  }, [user]);

  const toggleWishlist = (product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      
      // Sync to local storage
      localStorage.setItem("wishlist", JSON.stringify(updated));
      
      // Sync to DB
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: updated }),
      });

      return updated;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");
    if (user) {
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: [] }),
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => String(item.id) === String(productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
