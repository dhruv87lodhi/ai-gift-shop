"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  X, Gift, Cake, Search, 
  Monitor, Shirt, Home, Gamepad2, Wrench, Diamond,
  CalendarHeart, PartyPopper, HeartHandshake, Flame, TrendingUp, Star, Tag, Sparkles,
  Bell, Heart, User
} from "lucide-react";

export default function SidebarMenu({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (item) => {
    if (item.href) {
      router.push(item.href);
    } else {
      router.push(`/ai?q=${encodeURIComponent(item.query)}`);
    }
    onClose();
  };

  const sections = [
    {
      title: "My Vault",
      icon: <User className="w-5 h-5 text-primary" />,
      items: [
        { label: "My Vault (Wishlist)", href: "/wishlist", icon: <Heart className="w-4 h-4" /> },
        { label: "Gift Reminders", href: "/reminders", icon: <Bell className="w-4 h-4" /> },
        { label: "My Profile", href: "/profile", icon: <User className="w-4 h-4" /> },
      ]
    },
    {
      title: "Gift Finder",
      icon: <Search className="w-5 h-5 text-[#9a7638]" />,
      items: [
        { label: "Birthday Gifts", query: "Birthday" },
        { label: "Personalized Gifts", query: "Personalized" },
        { label: "Anniversary Gifts", query: "Anniversary" },
        { label: "Gifts for Him", query: "Him" },
        { label: "Gifts for Her", query: "Her" },
        { label: "Gifts for Friends", query: "Friends" },
        { label: "Gifts Under $500", query: "Under 500" },
        { label: "Gifts Under $1000", query: "Under 1000" },
      ]
    },
    {
      title: "By Category",
      icon: <Monitor className="w-5 h-5 text-[#9a7638]" />,
      items: [
        { label: "Tech", query: "Tech", icon: <Monitor className="w-4 h-4" /> },
        { label: "Fashion", query: "Fashion", icon: <Shirt className="w-4 h-4" /> },
        { label: "Home Decor", query: "Home Decor", icon: <Home className="w-4 h-4" /> },
        { label: "Accessories", query: "Accessories", icon: <Diamond className="w-4 h-4" /> },
        { label: "Gaming", query: "Gaming", icon: <Gamepad2 className="w-4 h-4" /> },
        { label: "Handmade", query: "Handmade", icon: <Wrench className="w-4 h-4" /> },
      ]
    },
    {
      title: "By Occasion",
      icon: <Cake className="w-5 h-5 text-[#9a7638]" />,
      items: [
        { label: "Birthday", query: "Birthday" },
        { label: "Anniversary", query: "Anniversary" },
        { label: "Wedding", query: "Wedding" },
        { label: "Farewell", query: "Farewell" },
        { label: "Congratulations", query: "Congratulations" },
      ]
    },
    {
      title: "By Festivals",
      icon: <PartyPopper className="w-5 h-5 text-[#9a7638]" />,
      items: [
        { label: "Diwali", query: "Diwali" },
        { label: "Christmas", query: "Christmas" },
        { label: "New Year", query: "New Year" },
        { label: "Valentine's Day", query: "Valentine's Day" },
      ]
    },
    {
      title: "By Special Days",
      icon: <CalendarHeart className="w-5 h-5 text-[#9a7638]" />,
      items: [
        { label: "Mother's Day", query: "Mother's Day" },
        { label: "Father's Day", query: "Father's Day" },
        { label: "Friendship Day", query: "Friendship Day" },
        { label: "Teacher's Day", query: "Teacher's Day" },
      ]
    },
    {
      title: "Featured Collections",
      icon: <Sparkles className="w-5 h-5 text-[#9a7638]" />,
      items: [
        { label: "Trending Gifts", query: "Trending", icon: <Flame className="w-4 h-4 text-orange-500" /> },
        { label: "Best Sellers", query: "Best Seller", icon: <Star className="w-4 h-4 text-yellow-500" /> },
        { label: "New Arrivals", query: "New Arrival", icon: <Gift className="w-4 h-4 text-green-500" /> },
        { label: "Budget Picks", query: "Budget", icon: <Tag className="w-4 h-4 text-blue-500" /> },
        { label: "Premium Gifts", query: "Luxury", icon: <Diamond className="w-4 h-4 text-purple-500" /> },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[85vw] sm:w-80 bg-ivory border-r border-white/20 z-[70] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.1)] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-black text-xl tracking-tighter text-charcoal block leading-none">Giftora</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-secondary">Menu</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal bg-white rounded-full shadow-sm hover:shadow-md transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <span className="opacity-50">{section.icon}</span>
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    {section.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => handleNavigation(item)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-2xl group ${
                          pathname === item.href 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-gray-500 hover:text-primary hover:bg-white hover:shadow-md'
                        }`}
                      >
                        {item.icon && <span className={`transition-transform group-hover:scale-110 ${pathname === item.href ? 'text-white' : 'text-primary/40'}`}>{item.icon}</span>}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 shrink-0 bg-gray-50">
              <p className="text-xs text-center text-gray-400">
                Giftora AI © 2026
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
