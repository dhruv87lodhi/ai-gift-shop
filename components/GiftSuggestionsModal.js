"use client";

import { X, Sparkles, Gift, ExternalLink, ChevronRight, ShoppingCart, Check, Plus } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";

export default function GiftSuggestionsModal({ isOpen, onClose, event }) {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [displayLimit, setDisplayLimit] = useState(3);

  // AI Recommendation Logic
  const allSuggestions = useMemo(() => {
    if (!event) return [];
    const occasionName = (event.occasion || event.name || "").toLowerCase();
    const relation = (event.relation || event.relationship || "loved one").toLowerCase();
    const tags = event.tags || [];

    let filtered = [];

    // 1. If tags exist (Global Occasions), filter by tags
    if (tags.length > 0) {
      filtered = products.filter(p => 
        tags.some(tag => 
          p.category.toLowerCase().includes(tag.toLowerCase()) || 
          p.description.toLowerCase().includes(tag.toLowerCase()) ||
          p.name.toLowerCase().includes(tag.toLowerCase()) ||
          p.tags?.some(pt => pt.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    // 2. If no tag matches or it's a personal event, filter by occasion/relation
    if (filtered.length === 0) {
      filtered = products.filter(p => 
        p.occasions?.some(occ => occasionName.includes(occ.toLowerCase()))
      );

      // Boost by relationship
      if (relation.includes("brother") || relation.includes("friend")) {
        filtered = [...filtered, ...products.filter(p => p.category.toLowerCase() === "gaming" || p.category.toLowerCase() === "tech")];
      } else if (relation.includes("mom") || relation.includes("mother") || relation.includes("wife") || relation.includes("sister")) {
        filtered = [...filtered, ...products.filter(p => p.category.toLowerCase() === "jewelry" || p.category.toLowerCase() === "lifestyle")];
      }
    }

    // 3. Final Fallback: just show trending products if nothing matches
    if (filtered.length === 0) {
      filtered = products.slice(0, 8);
    }

    // Remove duplicates and pick 3 unique ones
    const uniqueGifts = [...new Map(filtered.map(item => [item.id, item])).values()];
    
    return uniqueGifts.sort(() => 0.5 - Math.random());
  }, [event]);

  if (!isOpen || !event) return null;

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleShowMore = () => {
    setDisplayLimit(prev => prev + 3);
  };

  const currentSuggestions = allSuggestions.slice(0, displayLimit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-500 animate-in fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* Left Side: Context */}
        <div className="bg-gray-50 w-full md:w-80 p-10 flex flex-col justify-between border-r border-gray-100">
          <div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 inline-flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-[#c49b63]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">
              Giftora's Pick for <br />
              <span className="text-[#c49b63]">{event.name || event.occasion}</span>
            </h2>
            <p className="text-gray-500 mt-4 text-sm leading-relaxed">
              Based on the {event.tags ? 'event tags' : 'relationship'} and occasion, our AI has curated these exclusive gifts that will be absolutely perfect.
            </p>
          </div>
          
          <div className="mt-10 p-5 bg-white rounded-2xl border border-gray-100 italic text-sm text-gray-500">
             "The best gifts are the ones that tell a story."
          </div>
        </div>

        {/* Right Side: Suggestions List */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Recommended for you
            </div>
            <button onClick={() => { setDisplayLimit(3); onClose(); }} className="p-2 hover:bg-gray-100 rounded-full transition group">
              <X className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
            </button>
          </div>

          <div className="space-y-6">
            {currentSuggestions.map((gift) => (
              <div key={gift.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] border border-gray-100 hover:border-[#c49b63]/50 hover:shadow-xl transition group bg-white">
                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden relative flex-shrink-0">
                  <img src={gift.image} alt={gift.name} className="object-cover w-full h-full group-hover:scale-110 transition duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{gift.name}</h4>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{gift.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#c49b63]">₹{gift.price.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Premium Choice</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <Link href={`/product/${gift.id}`} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#c49b63] transition flex items-center gap-2">
                      Details <ChevronRight className="w-3 h-3" />
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(gift)}
                      className="text-[#c49b63] text-xs font-bold flex items-center gap-2 hover:underline disabled:opacity-50"
                      disabled={addedItems[gift.id]}
                    >
                      {addedItems[gift.id] ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" /> Add to cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayLimit < allSuggestions.length && (
            <button 
              onClick={handleShowMore}
              className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-[#c49b63] hover:text-[#c49b63] transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              View More Suggestions for {event.name || event.occasion}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
