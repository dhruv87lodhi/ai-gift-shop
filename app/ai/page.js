"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Loader2, Gift, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Chatbot from "@/components/Chatbot";
import { useWishlist } from "@/context/WishlistContext";

function AIResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [topMatches, setTopMatches] = useState([]);
  const [closeMatches, setCloseMatches] = useState([]);
  const query = searchParams.get("q") || searchParams.get("interests") || "gifts";

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsAnalyzing(true);
      try {
        const response = await fetch(`http://localhost:8000/recommend?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        const all = data.recommendations || [];
        
        // Split into Top Matches (first 3) and Close Options (rest)
        const top = all.slice(0, 3).map(product => ({
          ...product,
          aiReasoning: `Based on your specific interests, the ${product.name} is our top AI-picked choice. It matches your search perfectly.`
        }));
        
        const close = all.slice(3, 7).map(product => ({
          ...product,
          aiReasoning: `While slightly different, this is a fantastic alternative that still captures the spirit of what you're looking for.`
        }));

        setTopMatches(top);
        setCloseMatches(close);
      } catch (error) {
        console.error("AI Page Error:", error);
        setTopMatches([]);
        setCloseMatches([]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchRecommendations();
  }, [query]);

  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#caa161] rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="p-6 bg-white rounded-full border border-[#caa161] shadow-2xl relative z-10">
            <Loader2 className="w-12 h-12 text-[#caa161] animate-spin" />
          </div>
        </motion.div>
        
        <h2 className="mt-8 text-2xl font-bold text-gray-900 mb-2">
          Aura is finding the best matches...
        </h2>
        <p className="text-gray-500 max-w-md text-center">
          Searching through 100+ unique gifts for you.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
    <div>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#caa161] mb-4 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Start Over
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-[#caa161]" />
        Your AI Recommendations
      </h1>

      <p className="mt-2 text-lg text-gray-600">
        Curated specifically for your search: "{query}".
      </p>
    </div>
  </div>

  <div className="space-y-16">
    {/* Top Recommendations */}
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 bg-[#caa161] rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">Top Recommendations</h2>
      </div>
      <div className="space-y-8">
        {topMatches.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex flex-col md:flex-row gap-6 p-6 glass rounded-3xl border border-gray-200 hover:border-[#caa161] transition-colors"
          >
            {/* Image */}
            <div className="w-full md:w-64 aspect-square relative rounded-2xl overflow-hidden shrink-0 bg-gray-100 group">
              <img 
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.onerror = null; }}
              />
              <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(item); }}
                className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors z-10"
              >
                <Heart className={`w-5 h-5 transition-colors ${isInWishlist(item.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
              </button>
            </div>
            {/* Details */}
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#caa161] mb-1 block">{item.category}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                </div>
                <span className="text-xl font-extrabold text-gray-900">₹{Number(item.price).toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-4 p-5 bg-[#caa161]/10 rounded-2xl border border-[#caa161]/20 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#caa161]" />
                  <span className="text-sm font-bold text-[#caa161]">Why it's perfect</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{item.aiReasoning}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <Link href={`/product/${item.id}`} className="flex-1 py-3 bg-[#caa161] text-white text-center font-bold rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" /> View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Close Options */}
    {closeMatches.length > 0 && (
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1 bg-gray-400 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">More Options</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {closeMatches.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass p-4 rounded-2xl border border-gray-200 hover:border-gray-400 transition-all group"
            >
              <div className="aspect-square relative rounded-xl overflow-hidden mb-4 bg-gray-100">
                <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.onerror = null; }} />
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg">₹{Number(item.price).toLocaleString('en-IN')}</div>
                <button 
                  onClick={(e) => { e.preventDefault(); toggleShortlist(item); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors z-10"
                >
                  <Heart className={`w-4 h-4 transition-colors ${isInWishlist(item.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{item.category}</p>
              <Link href={`/product/${item.id}`} className="block w-full py-2 bg-gray-100 text-gray-900 text-center text-xs font-bold rounded-lg hover:bg-[#caa161] hover:text-white transition-colors">
                Quick View
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    )}
  </div>
</div>
  );
}

export default function AIPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
        <AIResultsContent />
      </Suspense>
      <Chatbot />
    </div>
  );
}
