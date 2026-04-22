"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Loader2, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { products } from "@/data/mockData";
import Chatbot from "@/components/Chatbot";

function AIResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  const recipient = searchParams.get("recipient") || "someone special";
  const occasion = searchParams.get("occasion") || "a special event";
  const interests = searchParams.get("interests") || "something nice";

  useEffect(() => {
    // Simulate AI thinking time
    const timer = setTimeout(() => {
      // Mock logic to select products
      const selected = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      // Generate reasoning for each product
      const withReasoning = selected.map(product => {
        let reasoning = "";
        if (product.category === "tech") {
          reasoning = `Since they are interested in ${interests}, and it's their ${occasion}, this ${product.name} is a fantastic choice. It brings the latest technology to their daily routine, which fits perfectly with their lifestyle.`;
        } else if (product.category === "jewelry") {
          reasoning = `A beautiful ${occasion} calls for something timeless. Given that you're shopping for ${recipient}, this exquisite ${product.name} adds a personal, elegant touch that they will cherish forever.`;
        } else {
          reasoning = `Based on their interest in ${interests}, the ${product.name} stands out as a thoughtful gift for ${recipient}. It perfectly captures the spirit of this ${occasion} by offering something truly unique.`;
        }
        return { ...product, aiReasoning: reasoning };
      });

      setRecommendations(withReasoning);
      setIsAnalyzing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [recipient, occasion, interests]);

  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#caa161] rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-full border border-[#caa161] dark:border-[#caa161] shadow-2xl relative z-10">
            <Loader2 className="w-12 h-12 text-[#caa161] dark:text-[#caa161] animate-spin" />
          </div>
        </motion.div>
        
        <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Aura AI is analyzing...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center animate-pulse">
          Finding the perfect gifts for {recipient}'s {occasion} based on their interest in {interests}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
    <div>
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-[#caa161] mb-4 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Start Over
      </button>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-[#caa161]" />
        Your AI Recommendations
      </h1>

      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Curated specifically for {recipient}'s {occasion}.
      </p>
    </div>
  </div>

  <div className="space-y-8">
    {recommendations.map((item, index) => (
      <motion.div 
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 }}
        className="flex flex-col md:flex-row gap-6 p-6 glass rounded-3xl border border-gray-200 dark:border-zinc-800 hover:border-[#caa161] transition-colors"
      >

        {/* Image */}
        <div className="w-full md:w-64 aspect-square relative rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-800">
          <Image 
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#caa161] mb-1 block">
                {item.category}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.name}
              </h3>
            </div>

            <span className="text-xl font-extrabold text-gray-900 dark:text-white">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {/* AI Reason */}
          <div className="mt-4 p-5 bg-[#caa161]/10 dark:bg-[#caa161]/20 rounded-2xl border border-[#caa161]/20 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#caa161]" />
              <span className="text-sm font-bold text-[#caa161]">Why it's perfect</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {item.aiReasoning}
            </p>
          </div>

          {/* Button */}
          <div className="mt-6 flex gap-3">
            <Link 
              href={`/product/${item.id}`}
              className="flex-1 py-3 bg-[#d9d9d9] text-black text-center font-bold rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              View Gift Details
            </Link>
          </div>
        </div>
      </motion.div>
    ))}
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
