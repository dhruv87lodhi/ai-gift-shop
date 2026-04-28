"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [giftNote, setGiftNote] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  // Load from local storage if available (only if we have a user or want to support guest carts)
  // But user requested: "only show cart items when user is logged in"
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Normalize IDs to strings
          const normalized = parsed.map(item => ({
            ...item,
            id: String(item.id)
          }));
          setCartItems(normalized);
        } catch (e) {
          console.error("Failed to parse cart data", e);
        }
      }

      const savedNote = localStorage.getItem("giftNote");
      if (savedNote) {
        try {
          setGiftNote(JSON.parse(savedNote));
        } catch (e) {
          console.error("Failed to parse gift note data", e);
        }
      }
      
      // Fetch cart from backend
      fetch("/api/cart")
        .then(res => res.json())
        .then(data => {
          if (data.cart && data.cart.length > 0) {
            // Merge local cart with DB cart
            setCartItems(prev => {
              // Normalize and deduplicate DB cart items
              const normalizedDbCart = data.cart.reduce((acc, item) => {
                const id = String(item.id);
                const existing = acc.find(i => i.id === id);
                if (existing) {
                  existing.quantity = Math.max(existing.quantity, item.quantity);
                  return acc;
                }
                return [...acc, { ...item, id }];
              }, []);
              
              const combined = [...normalizedDbCart];
              
              prev.forEach(localItem => {
                const localId = String(localItem.id);
                const existingIndex = combined.findIndex(dbItem => String(dbItem.id) === localId);
                
                if (existingIndex !== -1) {
                  combined[existingIndex].quantity = Math.max(combined[existingIndex].quantity, localItem.quantity);
                } else {
                  combined.push({ ...localItem, id: localId });
                }
              });
              return combined;
            });
          }
        });
    } else {
      // If no user, clear the cart state and local storage
      setCartItems([]);
      setGiftNote(null);
      localStorage.removeItem("cart");
      localStorage.removeItem("giftNote");
    }
  }, [user]);

  // Save to local storage and sync with backend
  useEffect(() => {
    if (user) {
      if (cartItems.length > 0) {
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
      } else {
        localStorage.removeItem("cart");
      }
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (user) {
      if (giftNote) {
        localStorage.setItem("giftNote", JSON.stringify(giftNote));
      } else {
        localStorage.removeItem("giftNote");
      }
    }
  }, [giftNote, user]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      router.push("/login?redirect=current");
      return;
    }
    const productId = String(product.id);
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === productId);
      if (existing) {
        return prev.map((item) =>
          String(item.id) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, id: productId, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    const id = String(productId);
    setCartItems((prev) => prev.filter((item) => String(item.id) !== id));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const id = String(productId);
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setGiftNote(null);
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
        giftNote,
        setGiftNote,
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
