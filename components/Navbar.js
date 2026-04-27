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
        className="fixed w-full z-40 glass border-b border-gray-200 transition-all duration-500 ease-in-out"
        style={{
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: navVisible ? "auto" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* LEFT: Menu Button + Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-black/5 rounded-lg transition focus:outline-none"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-[#caa161] p-1.5 sm:p-2 rounded-xl text-white shadow-lg shadow-[#caa161]/20 group-hover:scale-105 transition-transform">
                  <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 hidden sm:block group-hover:text-[#caa161] transition-colors">
                  AuraGifts
                </span>
              </Link>
            </div>

            {/* MIDDLE: Search Bar */}
            <div className="flex-1 max-w-2xl px-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#caa161] transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts, categories, or occasions..."
                  className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent transition-all focus:bg-white"
                />
              </form>
            </div>

            {/* RIGHT: Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/reminders" className="p-2 text-gray-500 hover:text-[#caa161] hover:bg-[#caa161]/10 rounded-full transition relative" title="Reminders">
                <Bell className="h-5 w-5" />
              </Link>
              
              <Link href="/wishlist" className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition relative" title="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-400 rounded-full border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-500 hover:text-[#caa161] hover:bg-[#caa161]/10 rounded-full transition" title="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#b08a50] rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link
                href={user ? "/profile" : "/login"}
                className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#caa161] hover:text-white transition-colors flex items-center gap-2 shadow-lg hover:shadow-[#caa161]/20"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{user ? "Profile" : "Login"}</span>
              </Link>
            </div>

            {/* Mobile Action menu buttons */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-black/5 focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Search className="w-5 h-5" />}
              </button>
              
              <Link href="/cart" className="relative p-2 text-gray-500 hover:text-[#caa161] transition">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#b08a50] rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown (Search + Quick Actions) */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-200 absolute w-full pb-4 shadow-xl">
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#caa161]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts..."
                  className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#caa161]/50 focus:bg-white"
                  autoFocus
                />
              </form>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <Link href="/reminders" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-gray-500 hover:bg-black/5 hover:text-[#caa161] text-left transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Bell className="w-5 h-5" /> Reminders
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-gray-500 hover:bg-red-400/10 hover:text-red-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" /> Wishlist
              </Link>
              <Link
                href={user ? "/profile" : "/login"}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-gray-500 hover:bg-black/5 hover:text-[#caa161] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" /> {user ? "Profile" : "Login"}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Component */}
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

