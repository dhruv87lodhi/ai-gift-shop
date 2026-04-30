'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    // Load seller state from localStorage
    const savedSellerMode = localStorage.getItem('giftora_seller_mode');
    const savedSellerProfile = localStorage.getItem('giftora_seller_profile');
    const savedSellerProducts = localStorage.getItem('giftora_seller_products');
    if (savedSellerMode === 'true') setIsSeller(true);
    if (savedSellerProfile) {
      try { setSellerProfile(JSON.parse(savedSellerProfile)); } catch(e) {}
    }
    if (savedSellerProducts) {
      try { setSellerProducts(JSON.parse(savedSellerProducts)); } catch(e) {}
    }
  }, []);

  // Persist seller state
  useEffect(() => {
    localStorage.setItem('giftora_seller_mode', isSeller.toString());
  }, [isSeller]);

  useEffect(() => {
    if (sellerProfile) {
      localStorage.setItem('giftora_seller_profile', JSON.stringify(sellerProfile));
    }
  }, [sellerProfile]);

  useEffect(() => {
    localStorage.setItem('giftora_seller_products', JSON.stringify(sellerProducts));
  }, [sellerProducts]);

  // Special seed for JantaMart
  useEffect(() => {
    if (sellerProfile?.shopName === 'JantaMart' && sellerProducts.length === 0) {
      const initialProducts = [
        {
          id: 'prod_janta_1',
          name: "Classic Red Rose Bouquet",
          price: 499,
          category: "Flowers",
          description: "A beautiful arrangement of fresh red roses, perfect for expressing love and affection.",
          image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
          stock: 25,
          status: 'active',
          views: 124,
          sales: 18,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod_janta_2',
          name: "Belgium Chocolate Truffle Cake",
          price: 850,
          category: "Cakes",
          description: "Rich and decadent Belgian chocolate truffle cake, a delight for chocolate lovers.",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
          stock: 10,
          status: 'active',
          views: 312,
          sales: 45,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod_janta_3',
          name: "Personalized LED Photo Frame",
          price: 1200,
          category: "Personalized",
          description: "Beautiful LED photo frame that can be customized with your favorite memories.",
          image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&q=80",
          stock: 15,
          status: 'active',
          views: 256,
          sales: 32,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod_janta_4',
          name: "Minimalist Silver Promise Ring",
          price: 2500,
          category: "Jewelry",
          description: "Elegant silver promise ring with a minimalist design, symbolic of commitment.",
          image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80",
          stock: 5,
          status: 'active',
          views: 189,
          sales: 12,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod_janta_5',
          name: "Handmade Ceramic Vase",
          price: 1599,
          category: "Home Decor",
          description: "Unique handmade ceramic vase, perfect for adding a touch of elegance to any room.",
          image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80",
          stock: 8,
          status: 'active',
          views: 167,
          sales: 9,
          createdAt: new Date().toISOString()
        }
      ];
      setSellerProducts(initialProducts);
    }
  }, [sellerProfile, sellerProducts]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      await fetchUser();
      router.push('/profile');
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const signup = async (userData) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (res.ok) {
      await fetchUser();
      router.push('/profile');
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsSeller(false);
    router.push('/login');
  };

  const toggleSellerMode = () => {
    if (!isSeller && !sellerProfile) {
      // First time switching to seller — go to onboarding
      router.push('/seller/onboarding');
      return;
    }
    setIsSeller(prev => !prev);
  };

  const addSellerProduct = (product) => {
    const newProduct = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
      createdAt: new Date().toISOString(),
      views: 0,
      sales: 0,
      status: 'active',
    };
    setSellerProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateSellerProduct = (productId, updates) => {
    setSellerProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const deleteSellerProduct = (productId) => {
    setSellerProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, signup, logout, refreshUser: fetchUser,
      isSeller, setIsSeller, toggleSellerMode,
      sellerProfile, setSellerProfile,
      sellerProducts, addSellerProduct, updateSellerProduct, deleteSellerProduct,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
