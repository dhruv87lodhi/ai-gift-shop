"use client";

import Link from "next/link";
import { Gift, Menu, X, ShoppingBag, User, Search, Heart, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SidebarMenu from "./SidebarMenu";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const router = useRouter();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ai?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts, categories, or occasions..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 focus:bg-white transition-all shadow-sm"
                />
              </form>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="md:hidden p-2 text-gray-500 hover:text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Search className="h-5 w-5" />
              </button>

              <Link href="/reminders" className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition relative" title="Reminders">
                <Bell className="h-5 w-5" />
              </Link>

              <Link href="/wishlist" className="p-2 text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-full transition relative" title="Wishlist">
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
              
              <Link
                href={user ? "/profile" : "/login"}
                className="ml-1 bg-charcoal text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{user ? "Profile" : "Login"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-100 absolute w-full p-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10"
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
