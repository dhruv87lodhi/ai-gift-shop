"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  X, Gift, Cake, Search, 
  Monitor, Shirt, Home, Gamepad2, Wrench, Diamond,
  CalendarHeart, PartyPopper, HeartHandshake, Flame, TrendingUp, Star, Tag, Sparkles
} from "lucide-react";

export default function SidebarMenu({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (query) => {
    router.push(`/ai?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const sections = [
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
            className="fixed top-0 left-0 h-full w-[85vw] sm:w-80 bg-white border-r border-gray-200 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-[#caa161] p-1.5 rounded-lg text-white">
                  <Gift className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg text-gray-900">Aura Menu</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                    {section.icon}
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    {section.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => handleNavigation(item.query)}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-left"
                      >
                        {item.icon && <span className="opacity-70">{item.icon}</span>}
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
                AuraGifts AI © 2026
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
