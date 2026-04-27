"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  // Load from local storage if available (only if we have a user or want to support guest carts)
  // But user requested: "only show cart items when user is logged in"
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse cart data", e);
        }
      }
      
      // Fetch cart from backend
      fetch("/api/cart")
        .then(res => res.json())
        .then(data => {
          if (data.cart && data.cart.length > 0) {
            // Merge local cart with DB cart
            setCartItems(prev => {
              const combined = [...data.cart];
              prev.forEach(localItem => {
                const existing = combined.find(dbItem => dbItem.id === localItem.id);
                if (existing) {
                  existing.quantity = Math.max(existing.quantity, localItem.quantity);
                } else {
                  combined.push(localItem);
                }
              });
              return combined;
            });
          }
        });
    } else {
      // If no user, clear the cart state and local storage
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  }, [user]);

  // Save to local storage and sync with backend
  useEffect(() => {
    if (user && cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      
      // Throttled sync to backend
      const timer = setTimeout(() => {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cartItems }),
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!user) {
      localStorage.removeItem("cart");
    }
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      router.push("/login?redirect=current");
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
