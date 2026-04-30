"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, User, Gift, Search, Loader2, Bot, Send, Star, Mic, MicOff } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function DhruvPage() {
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);
   
  // Initialize speech recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please try Chrome or Edge.");
      return;
    }

    // If already listening, stop it (toggle behavior)
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false; // Stop after one result

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
      performSearch(transcript);
    };

    recognition.onerror = (event) => {
      // Don't show error if it was just aborted manually
      if (event.error !== 'aborted') {
        console.error("Speech Recognition Error:", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setIsListening(false);
    }
  };

  const performSearch = async (searchPrompt) => {
    if (!searchPrompt.trim()) return;

    setIsThinking(true);
    setHasSearched(true);
    setAiResponse("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: searchPrompt }),
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data = await response.json();
      setAiResponse(data.response);
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("AI Search Error:", error);
      setAiResponse("I'm sorry, I'm having trouble connecting to my AI brain. Please try again in a moment.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleAISearch = async (e) => {
    if (e) e.preventDefault();
    performSearch(prompt);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#caa161]/5 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#caa161] mb-12 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 font-inter mb-12 leading-relaxed"
            >
              Describe who you're shopping for, their interests, and your budget.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full relative group"
            >
              <form onSubmit={handleAISearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Sparkles className="h-6 w-6 text-primary group-focus-within:animate-pulse" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={isListening ? "Listening..." : "e.g. A unique gift for my sister who loves space and gardening under 2000"}
                  className={`w-full bg-white border-2 border-gray-100 rounded-[2rem] py-6 pl-16 pr-32 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-8 focus:ring-[#caa161]/5 focus:border-[#caa161]/30 transition-all shadow-2xl shadow-primary/5 ${isListening ? "border-primary/50 ring-8 ring-primary/5" : ""}`}
                  disabled={isThinking}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={isThinking}
                    className={`p-4 rounded-[1.5rem] transition-all flex items-center justify-center ${isListening ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-200" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                    title="Search by voice"
                  >
                    {isListening ? <Mic className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isThinking || isListening}
                    className="bg-charcoal text-white p-4 rounded-[1.5rem] hover:bg-primary transition-all disabled:opacity-50 shadow-lg"
                  >
                    {isThinking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Gift className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-400">Waiting for your prompt...</h2>
              <p className="text-gray-400 mt-2">The magic happens when you tell me who you're shopping for.</p>
            </motion.div>
          ) : isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="bg-white p-8 rounded-full border border-primary/20 relative z-10">
                  <Sparkles className="w-12 h-12 text-primary animate-bounce" />
                </div>
              </div>

              <p className="text-gray-500 mt-2">Searching the vault for the most meaningful gifts.</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* AI Message */}
              <div className="glass p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Sparkles className="w-4 h-4" />
                    </div>

                  </div>
                  <p className="text-2xl text-gray-800 font-inter leading-relaxed italic">
                    "{aiResponse}"
                  </p>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 font-outfit flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    Handpicked Matches
                  </h2>
                  <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {recommendations.length} Results Found
                  </span>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recommendations.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">I found the prompt interesting, but couldn't find exact product matches. Try broadening your description!</p>
                  </div>
                )}
              </div>

              {/* Reset Search */}
              <div className="flex justify-center">
                <button
                  onClick={() => { setHasSearched(false); setPrompt(""); setRecommendations([]); }}
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-500 font-bold rounded-2xl hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Start New Search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

