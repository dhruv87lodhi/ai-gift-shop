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
