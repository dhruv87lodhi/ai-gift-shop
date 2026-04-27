'use client';

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#caa161]/10 rounded-full">
            <Heart className="w-4 h-4 text-[#9a7638] fill-current" />
            <span className="text-sm font-bold text-[#9a7638]">{wishlist.length} Items</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Heart className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">The vault is empty</h2>
            <p className="text-gray-400 mb-10 max-w-xs mx-auto font-medium">Found something you love? Save it here for later.</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10"
            >
              Start Exploring
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
