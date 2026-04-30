"use client";

import Link from "next/link";
import { Gift, Menu, X, ShoppingBag, User, Search, Heart, Bell, MapPin, LogOut, Navigation } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SidebarMenu from "./SidebarMenu";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navVisible, setNavVisible] = useState(true);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("");
  const [savedPincode, setSavedPincode] = useState("");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const dropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  // Process reminders for dropdown
  const upcomingReminders = (user?.giftReminders || [])
    .map(r => {
      const date = new Date(r.date);
      const diff = date - new Date();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return { ...r, daysLeft: days };
    })
    .filter(r => r.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 50) {
            setNavVisible(true);
          } else if (currentScrollY > lastScrollY.current) {
            setNavVisible(false);
          } else {
            setNavVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userPincode");
    if (saved) {
      setSavedPincode(saved);
      setPincodeInput(saved);
    }
  }, []);

  const handleSaveLocation = () => {
    if (pincodeInput.trim()) {
      localStorage.setItem("userPincode", pincodeInput.trim());
      setSavedPincode(pincodeInput.trim());
      setShowLocationDropdown(false);
      router.push("/discover");
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const mockPincodes = ["110001", "400001", "560001", "600001"];
          const randomPincode = mockPincodes[Math.floor(Math.random() * mockPincodes.length)];
          localStorage.setItem("userPincode", randomPincode);
          setSavedPincode(randomPincode);
          setPincodeInput(randomPincode);
          setShowLocationDropdown(false);
          router.push("/discover");
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ai?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    setShowModeDropdown(prev => !prev);
  };

  const goToDestination = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
    setShowModeDropdown(false);
  };

  return (
    <>
      <nav
        className="fixed w-full z-50 glass border-b border-gray-100 transition-all duration-500 ease-in-out"
        style={{
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: navVisible ? "auto" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* LEFT: Menu Button + Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="h-6 w-6" />
                </div>
                <div className="flex flex-col -gap-1 hidden sm:flex">
                  <span className="font-black text-2xl tracking-tighter text-charcoal group-hover:text-primary transition-colors leading-none">
                    Giftora
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary ml-0.5 leading-none mt-1">
                    AI Gift Shop
                  </span>
                </div>
              </Link>
            </div>

            {/* MIDDLE: Search Bar (Desktop) */}
            <div className="flex-1 max-w-2xl px-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts, categories, or occasions..."
                  className="w-full bg-white/60 backdrop-blur-md border-2 border-primary/10 rounded-[1.5rem] py-3.5 pl-14 pr-6 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-8 focus:ring-primary/10 focus:border-primary/30 focus:bg-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                />
              </form>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="md:hidden p-2 text-gray-500 hover:text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Search className="h-5 w-5" />
              </button>

              {/* Discover Location Dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <button 
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition hidden sm:flex relative" 
                  title="Discover Nearby"
                >
                  <MapPin className="h-5 w-5" />
                  {savedPincode && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </button>

                <AnimatePresence>
                  {showLocationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] p-5"
                    >
                      <h3 className="text-sm font-black text-charcoal mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Choose your location
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enter Pincode</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={pincodeInput}
                              onChange={(e) => setPincodeInput(e.target.value)}
                              placeholder="e.g. 110001"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-charcoal focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                            <button
                              onClick={handleSaveLocation}
                              className="bg-charcoal text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-colors"
                            >
                              Go
                            </button>
                          </div>
                        </div>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-[10px] font-bold text-gray-400 uppercase">Or</span>
                          </div>
                        </div>

                        <button
                          onClick={handleUseCurrentLocation}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-bold text-charcoal hover:bg-gray-50 transition-colors"
                        >
                          <Navigation className="w-4 h-4 text-primary" />
                          Use Current Location
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reminders Link */}
              <Link 
                href="/reminders"
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition relative" 
                title="Reminders"
              >
                <Bell className="h-5 w-5" />
                {upcomingReminders.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
                )}
              </Link>

              {/* Wishlist Link */}
              <Link 
                href="/wishlist"
                className="p-2 text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-full transition relative" 
                title="Wishlist"
              >
                <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-secondary text-secondary' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-secondary rounded-full border border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition" title="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-primary rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="ml-1 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center gap-2 bg-charcoal text-white hover:bg-primary hover:shadow-primary/20"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{user ? "Profile" : "Login"}</span>
                </button>
 
                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {showModeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                    >
                      {/* User Info */}
                      {user ? (
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-black text-primary">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-charcoal text-sm truncate">{user.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-charcoal text-sm truncate">Guest</p>
                              <p className="text-[10px] text-gray-400 font-medium truncate">Sign in to sync your data</p>
                            </div>
                          </div>
                        </div>
                      )}
 
                      {/* Quick Links */}
                      <div className="px-4 py-4 space-y-1">
                        <button
                          onClick={goToDestination}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          <User className="w-4 h-4" />
                          {user ? 'My Profile' : 'Login'}
                        </button>

                        <Link
                          href="/discover"
                          onClick={() => setShowModeDropdown(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          <MapPin className="w-4 h-4" />
                          Discover Nearby
                        </Link>

                        {user && (
                          <button
                            onClick={() => {
                              setShowModeDropdown(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all mt-2 border-t border-gray-100 pt-3"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-100 absolute w-full p-6 animate-fade-in-up">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts..."
                className="w-full bg-white border-2 border-primary/20 rounded-2xl py-4 pl-14 pr-6 text-base text-charcoal focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all shadow-lg"
                autoFocus
              />
            </form>
          </div>
        )}
      </nav>

      {/* Sidebar Component */}
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
