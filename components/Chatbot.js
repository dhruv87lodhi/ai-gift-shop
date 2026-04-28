"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, User, Gift, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: "bot", 
      text: "Hi there! 👋 I'm Giftora, your personal AI Gift Assistant. Who are you shopping for today?",
      suggestions: ["Mom", "Partner", "Friend", "Colleague"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Conversation state is now handled by the backend

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener("toggle-chatbot", handleToggle);
    return () => window.removeEventListener("toggle-chatbot", handleToggle);
  }, []);

  const processInput = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: "user", text };
    
    // Update local UI immediately with user message
    setMessages((prev) => {
      const newMsgs = [...prev];
      const lastMsg = newMsgs[newMsgs.length - 1];
      if (lastMsg && lastMsg.type === "bot") {
        lastMsg.suggestions = null;
      }
      return [...newMsgs, userMsg];
    });
    
    setInputValue("");
    setIsTyping(true);

    const startTime = Date.now();

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI service");

      const data = await response.json();
      
      // Ensure a snappy but natural feel (500ms delay)
      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(0, 500 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, delay));

      const botMsg = { 
        id: Date.now() + 1, 
        type: "bot", 
        text: data.response,
        suggestions: data.suggestions || null,
        recommendations: data.recommendations || null
      };

      setMessages((prev) => [...prev, botMsg]);

      // If recommendations are returned, redirect after a longer delay
      if (data.finished && data.recommendations) {
        setTimeout(() => {
          setIsOpen(false);
          const params = new URLSearchParams({
            q: text,
            isAI: "true"
          });
          router.push(`/ai?${params.toString()}`);
        }, 2000); // Give user 2 seconds to see the "close options" in chat
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          type: "bot", 
          text: "I'm having trouble connecting to my brain right now. 🧠 (Make sure the AI service is running on port 8000!)" 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    processInput(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    processInput(suggestion);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        {!isOpen && (
          <div className="absolute inset-0 bg-[#caa161] rounded-full animate-ping opacity-20"></div>
        )}
        <motion.button
          className="relative p-4 rounded-full bg-gradient-to-tr from-[#caa161] via-[#b08a50] to-[#9a7638] text-white shadow-[0_0_20px_rgba(202,161,97,0.3)] flex items-center justify-center overflow-hidden group"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <Sparkles className="w-7 h-7 relative z-10" />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[85vh] bg-ivory rounded-[2.5rem] shadow-[0_40px_100px_-12px_rgba(0,0,0,0.2)] flex flex-col z-50 border border-white/60 overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#caa161] via-[#b08a50] to-[#9a7638] text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight tracking-wide">Giftora AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-xs text-white/90 font-medium">Online & ready to help</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth no-scrollbar relative">
              {/* Artistic Background Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "bot" && (
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 border border-primary/10 mt-1">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-2 max-w-[85%]`}>
                    <div
                      className={`p-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm font-medium ${
                        msg.type === "user"
                          ? "bg-charcoal text-white rounded-tr-sm"
                          : "bg-white text-charcoal rounded-tl-sm border border-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Inline Recommendations (Close Options) */}
                    {msg.recommendations && (
                      <div className="space-y-4 w-full">
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar scroll-smooth">
                          {msg.recommendations.slice(0, 4).map((prod, pidx) => (
                            <motion.div
                              key={pidx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: pidx * 0.1 }}
                              className="flex-shrink-0 w-36 bg-white border border-gray-200 rounded-xl p-2 hover:border-[#caa161]/50 transition-colors cursor-pointer group"
                              onClick={() => router.push(`/product/${prod.id}`)}
                            >
                              <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center relative">
                                 {prod.image ? (
                                   <img 
                                     src={prod.image} 
                                     alt={prod.name} 
                                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                     onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.onerror = null; }}
                                   />
                                 ) : (
                                   <Gift className="w-6 h-6 text-[#caa161] opacity-50" />
                                 )}
                                 <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-[#caa161] text-[10px] font-bold rounded text-white shadow-sm">
                                   ₹{prod.price}
                                 </div>
                              </div>
                              <h4 className="text-[11px] font-bold text-gray-800 line-clamp-1">{prod.name}</h4>
                              <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{prod.category}</p>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* VIEW ALL RESULTS BUTTON */}
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => {
                            const params = new URLSearchParams({ q: msg.text.split("SEARCH_QUERY:")[1] || "gifts", isAI: "true" });
                            router.push(`/ai?${params.toString()}`);
                          }}
                          className="w-full py-2.5 bg-[#caa161]/10 hover:bg-[#caa161]/20 text-[#9a7638] border border-[#caa161]/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                        >
                          View All 100+ Results
                          <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                        </motion.button>
                      </div>
                    )}

                    {/* Quick Suggestion Chips */}
                    {msg.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.suggestions.map((suggestion, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isTyping}
                            className="px-3 py-1.5 bg-white hover:bg-[#caa161]/10 text-gray-600 hover:text-[#9a7638] rounded-full text-xs font-semibold border border-gray-200 hover:border-[#caa161] transition-all"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 shadow-sm mt-1 border border-gray-200">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-[#caa161]/10 border border-[#caa161]/30 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-[#caa161]" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white rounded-tl-sm border border-gray-200 shadow-sm flex gap-1.5 items-center">
                    <motion.div 
                      className="w-2 h-2 bg-[#caa161] rounded-full" 
                      animate={{ y: [0, -6, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} 
                    />
                    <motion.div 
                      className="w-2 h-2 bg-[#b08a50] rounded-full" 
                      animate={{ y: [0, -6, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} 
                    />
                    <motion.div 
                      className="w-2 h-2 bg-[#9a7638] rounded-full" 
                      animate={{ y: [0, -6, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} 
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/40 backdrop-blur-md border-t border-white/60 relative z-10">
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Giftora anything..."
                  disabled={isTyping}
                  className="flex-1 bg-white border-2 border-primary/5 focus:border-primary/20 rounded-2xl px-6 py-4 text-[15px] focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all text-charcoal font-bold disabled:opacity-50 placeholder:text-gray-300"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-14 h-14 bg-charcoal text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-xl hover:bg-primary group"
                >
                  <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
