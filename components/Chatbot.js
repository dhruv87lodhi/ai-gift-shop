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
      text: "Hi there! 👋 I'm Aura, your personal AI Gift Assistant. Who are you shopping for today?",
      suggestions: ["Mom", "Partner", "Friend", "Colleague"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Track conversation state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    recipient: "",
    occasion: "",
    interests: ""
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const processInput = (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: "user", text };
    
    // Remove suggestions from the last bot message so they don't persist
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

    // AI Logic Flow
    setTimeout(() => {
      let botResponse = "";
      let suggestions = null;
      
      if (step === 0) {
        setAnswers(prev => ({ ...prev, recipient: text }));
        botResponse = `Got it, finding something amazing for ${text}. What is the special occasion?`;
        suggestions = ["Birthday", "Anniversary", "Wedding", "Just Because"];
        setStep(1);
      } else if (step === 1) {
        setAnswers(prev => ({ ...prev, occasion: text }));
        botResponse = "Perfect! Lastly, what are their main interests or hobbies?";
        suggestions = ["Tech Gadgets", "Gaming", "Lifestyle & Home", "Experiences"];
        setStep(2);
      } else if (step === 2) {
        setAnswers(prev => ({ ...prev, interests: text }));
        botResponse = "Excellent! I'm analyzing our entire catalog to find the perfect matches...";
        setStep(3);
        
        // Build URL and Redirect
        setTimeout(() => {
          const params = new URLSearchParams({
            recipient: answers.recipient || "them",
            occasion: answers.occasion || "special occasion",
            interests: text // the final answer
          });
          setIsOpen(false);
          router.push(`/ai?${params.toString()}`);
          
          // Reset chat state after redirect
          setTimeout(() => {
            setStep(0);
            setAnswers({ recipient: "", occasion: "", interests: "" });
            setMessages([{ 
              id: Date.now(), 
              type: "bot", 
              text: "Hi again! Who are you shopping for this time?",
              suggestions: ["Mom", "Partner", "Friend", "Colleague"] 
            }]);
          }, 1000);
        }, 2000);
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "bot", text: botResponse, suggestions }
      ]);
      setIsTyping(false);
    }, 1200);
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
          className="relative p-4 rounded-full bg-gradient-to-tr from-[#caa161] via-[#b08a50] to-[#9a7638] text-white shadow-[0_0_20px_rgba(202,161,97,0.5)] flex items-center justify-center overflow-hidden group"
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
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-[400px] h-[550px] max-h-[80vh] glass bg-[#151515]/95 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col z-50 border border-[#caa161]/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#caa161] via-[#b08a50] to-[#9a7638] text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight tracking-wide">Aura AI</h3>
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
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth bg-[#111]/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-[#caa161]/20 border border-[#caa161]/50 flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Sparkles className="w-4 h-4 text-[#caa161]" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-2 max-w-[80%]`}>
                    <div
                      className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        msg.type === "user"
                          ? "bg-gradient-to-br from-[#caa161] to-[#b08a50] text-white rounded-tr-sm"
                          : "bg-[#1a1a1a] text-gray-200 rounded-tl-sm border border-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>

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
                            disabled={step === 3 || isTyping}
                            className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#caa161]/20 text-gray-300 hover:text-[#caa161] rounded-full text-xs font-semibold border border-white/10 hover:border-[#caa161] transition-all"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 shadow-sm mt-1 border border-zinc-600">
                      <User className="w-4 h-4 text-gray-300" />
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
                  <div className="w-8 h-8 rounded-full bg-[#caa161]/20 border border-[#caa161]/50 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-[#caa161]" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#1a1a1a] rounded-tl-sm border border-white/5 shadow-sm flex gap-1.5 items-center">
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
            <div className="p-4 bg-[#151515]/90 backdrop-blur-xl border-t border-white/10 relative z-10">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={step === 3 || isTyping}
                  className="flex-1 bg-[#111] border border-white/10 focus:border-[#caa161] rounded-2xl px-5 py-3 text-[15px] focus:outline-none transition-all text-white disabled:opacity-50 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || step === 3}
                  className="p-3 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-5 h-5 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
