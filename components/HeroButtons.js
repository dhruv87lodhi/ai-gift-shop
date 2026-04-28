"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HeroButtons() {
  const openChatbot = () => {
    window.dispatchEvent(new CustomEvent("toggle-chatbot"));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <button 
        onClick={openChatbot}
        className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover transition-all transform hover:scale-105 shadow-xl shadow-primary/25 flex items-center justify-center gap-3 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Find My Gift
      </button>
      <button 
        onClick={() => {
          const element = document.getElementById('categories');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="w-full sm:w-auto px-10 py-5 border-2 border-primary/20 text-primary rounded-full font-bold text-lg hover:bg-primary/5 transition-colors flex items-center justify-center"
      >
        Shop Now
      </button>
    </div>
  );
}
