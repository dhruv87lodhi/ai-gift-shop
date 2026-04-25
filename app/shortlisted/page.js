"use client";

import { useShortlist } from "@/context/ShortlistContext";
import { Heart, ArrowLeft, Trash2, Gift } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShortlistedPage() {
  const { shortlist, toggleShortlist } = useShortlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          Shortlisted Gifts
        </h1>
      </div>

      {shortlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border border-white/10">
          <div className="bg-white/5 p-6 rounded-full mb-6">
            <Heart className="w-16 h-16 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No gifts shortlisted yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            When you see a gift you like, click the heart icon to save it here for later.
          </p>
          <Link href="/ai" className="bg-[#caa161] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition">
            Explore AI Recommendations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shortlist.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id}
              className="glass p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-[#caa161] transition-all group flex flex-col"
            >
              <div className="aspect-square relative rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-zinc-800">
                <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.onerror = null; }} />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg">${item.price}</div>
                <button
                  onClick={() => toggleShortlist(item)}
                  className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full hover:bg-red-500 transition-colors z-10 text-white hover:text-white"
                  title="Remove from shortlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-grow">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#caa161] mb-1 block">{item.category}</span>
                <h3 className="font-bold text-gray-900 dark:text-white truncate mb-4">{item.name}</h3>
              </div>
              
              <Link href={`/product/${item.id}`} className="block w-full py-2.5 bg-white/5 border border-white/10 text-white text-center text-xs font-bold rounded-xl hover:bg-[#caa161] hover:border-[#caa161] transition-colors flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" /> View Gift
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
