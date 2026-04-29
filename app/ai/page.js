"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Loader2, Gift, Heart, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "@/components/Chatbot";
import { useWishlist } from "@/context/WishlistContext";

function AIResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // The full query from the chatbot (e.g. "under 1000 tech gaming")
  const query = searchParams.get("q") || searchParams.get("interests") || "gifts";

  // Extract numeric budget from query for the price slider default
  const extractBudget = (q) => {
    const match = q.match(/(?:under|below|budget|max|up to)\s*(\d+)/i) || q.match(/\b(\d{3,5})\b/);
    return match ? Number(match[1]) : 100000;
  };
  const [priceRange, setPriceRange] = useState(() => extractBudget(query));

  // Display-friendly label (hide the "under 1000 tech" raw query)
  const displayQuery = query.replace(/under\s+\d+\s*/i, "").trim() || query;

  useEffect(() => {
    // Update price range if query changes
    setPriceRange(extractBudget(query));

    const fetchRecommendations = async () => {
      setIsAnalyzing(true);
      try {
        // Send the FULL query string (with budget) so the backend can filter by price
        const response = await fetch(`http://localhost:8000/recommend?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        setAllRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("AI Page Error:", error);
        setAllRecommendations([]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchRecommendations();
  }, [query]);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(allRecommendations.map(item => item.category))];
    return cats;
  }, [allRecommendations]);

  const filteredMatches = useMemo(() => {
    return allRecommendations.filter(item => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchPrice = Number(item.price) <= priceRange;
      return matchCategory && matchPrice;
    });
  }, [allRecommendations, activeCategory, priceRange]);

  const topMatches = filteredMatches.slice(0, 3).map(product => ({
    ...product,
    aiReasoning: `Based on your specific interests, the ${product.name} is our top AI-picked choice. It matches your search perfectly.`
  }));

  const closeMatches = filteredMatches.slice(3, 12).map(product => ({
    ...product,
    aiReasoning: `While slightly different, this is a fantastic alternative that still captures the spirit of what you're looking for.`
  }));

  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#caa161] rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="p-8 bg-white rounded-full border border-[#caa161]/30 shadow-2xl relative z-10">
            <Loader2 className="w-12 h-12 text-[#caa161] animate-spin" />
          </div>
        </motion.div>
        
        <h2 className="mt-8 text-3xl font-bold text-gray-900 mb-2 font-outfit">
          Curating Your Perfect Matches
        </h2>
        <p className="text-gray-500 max-w-md text-center font-inter">
          Our AI is scanning the collection to find gifts that resonate with "{displayQuery}".
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#caa161] mb-6 transition-colors text-sm font-medium tracking-wide uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4 font-outfit">
              <Sparkles className="w-10 h-10 text-[#caa161]" />
              AI Recommendations
            </h1>
            <p className="mt-4 text-xl text-gray-600 font-inter max-w-2xl">
              Handpicked selections based on your unique profile and search: 
              <span className="text-[#caa161] font-semibold ml-2 text-2xl">"{displayQuery}"</span>.
            </p>
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-bold ${showFilters ? 'bg-[#caa161] text-white border-[#caa161]' : 'bg-white text-gray-900 border-gray-200 hover:border-[#caa161]'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Fine-tune Results'}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="glass p-8 rounded-3xl border border-gray-100 flex flex-wrap gap-12 items-start">
              {/* Category Filter */}
              <div className="flex-1 min-w-[250px]">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-[#caa161] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Max Budget</h3>
                  <span className="text-[#caa161] font-bold text-lg">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  step="500"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#caa161]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
                  <span>₹0</span>
                  <span>₹50,000+</span>
                </div>
              </div>

              {/* Reset */}
              <div className="flex items-end h-full pt-6">
                <button 
                  onClick={() => { setActiveCategory("All"); setPriceRange(100000); }}
                  className="text-gray-400 hover:text-gray-900 text-sm font-bold flex items-center gap-2 underline underline-offset-4"
                >
                  <X className="w-4 h-4" /> Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-24 pb-24">
        {/* Top Recommendations */}
        {topMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-1.5 bg-[#caa161] rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900 font-outfit">Top Tier Selection</h2>
              </div>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{topMatches.length} results</span>
            </div>
            
            <div className="grid grid-cols-1 gap-10">
              {topMatches.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col lg:flex-row gap-0 glass rounded-[40px] overflow-hidden border border-gray-100 group hover:shadow-2xl hover:shadow-[#caa161]/5 transition-all duration-500"
                >
                  {/* Image Part */}
                  <div className="w-full lg:w-[450px] aspect-[4/3] lg:aspect-square relative overflow-hidden shrink-0">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"; e.currentTarget.onerror = null; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(item); }}
                      className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all transform group-hover:scale-110 z-10"
                    >
                      <Heart className={`w-6 h-6 transition-colors ${isInWishlist(item.id) ? "fill-red-500 text-red-500" : "text-gray-900"}`} />
                    </button>
                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-widest">
                      {item.category}
                    </div>
                  </div>

                  {/* Content Part */}
                  <div className="flex flex-col flex-1 p-8 lg:p-12 justify-center">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-outfit tracking-tight">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3 h-3 text-[#caa161] fill-[#caa161]" />)}
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Highly Compatible</span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 font-outfit">₹{Number(item.price).toLocaleString('en-IN')}</div>
                    </div>

                    <div className="relative mt-2 mb-10">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#caa161]/30 rounded-full"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-[#caa161]" />
                        <span className="text-sm font-bold text-[#caa161] uppercase tracking-widest">The AI Insight</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg font-inter">
                        {item.aiReasoning}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link 
                        href={`/product/${item.id}`} 
                        className="flex-1 md:flex-none px-10 py-4 bg-gray-900 text-white text-center font-bold rounded-2xl hover:bg-[#caa161] transition-all flex items-center justify-center gap-3 group/btn"
                      >
                        <Gift className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" /> 
                        View Collection Item
                      </Link>
                      <button className="flex-1 md:flex-none px-10 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:border-[#caa161] transition-all">
                        Add to Selection
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* More Options */}
        {closeMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-10 w-1.5 bg-gray-200 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 font-outfit">Refined Alternatives</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {closeMatches.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass group rounded-3xl border border-gray-100 hover:border-[#caa161]/30 hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <div className="aspect-[5/4] relative overflow-hidden bg-gray-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.onerror = null; }} 
                    />
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist(item); }}
                        className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-110"
                      >
                        <Heart className={`w-5 h-5 transition-colors ${isInWishlist(item.id) ? "fill-red-500 text-red-500" : "text-gray-900"}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-[#caa161] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-[#caa161] transition-colors">{item.name}</h3>
                      <span className="font-bold text-lg text-gray-900">₹{Number(item.price).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <Link 
                      href={`/product/${item.id}`} 
                      className="flex items-center justify-center w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl group-hover:bg-[#caa161] group-hover:text-white transition-all"
                    >
                      Explore Piece
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredMatches.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-6 bg-gray-50 rounded-full mb-6">
              <Filter className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your filters to see more results.</p>
            <button 
              onClick={() => { setActiveCategory("All"); setPriceRange(100000); }}
              className="px-8 py-3 bg-[#caa161] text-white font-bold rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12">
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#caa161]" /></div>}>
        <AIResultsContent />
      </Suspense>
      <Chatbot />
    </div>
  );
}
