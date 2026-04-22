"use client";

import Link from "next/link";
import { Gift, Menu, X, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Occasions", href: "/occasion" },
    { name: "Categories", href: "/category" },
  ];

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#caa161] p-2 rounded-xl text-white shadow-lg shadow-[#caa161]/20">
                <Gift className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                AuraGifts
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[#caa161] ${pathname === link.href ? "text-[#caa161]" : "text-gray-300"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-[#caa161] transition">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#b08a50] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </div>

          <div className="-mr-2 flex md:hidden items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-[#caa161] transition">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#b08a50] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href ? "text-[#caa161]" : "text-gray-300 hover:bg-white/10"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/profile"
              className="flex items-center justify-center gap-2 px-3 py-2 mt-4 text-center rounded-md text-base font-medium bg-white text-black"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
