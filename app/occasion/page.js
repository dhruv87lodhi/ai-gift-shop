import { occasions } from "@/data/mockData";
import OccasionCard from "@/components/OccasionCard";
import Chatbot from "@/components/Chatbot";
import { Sparkles, CalendarDays } from "lucide-react";

export default function OccasionPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 mb-6 text-sm font-bold text-secondary animate-fade-in">
            <CalendarDays className="w-4 h-4" />
            MOMENTS TO CHERISH
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-charcoal leading-tight tracking-tighter mb-6 animate-fade-in-up">
            Shop By <span className="text-secondary italic">Occasion</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Make every celebration unforgettable. From grand weddings to intimate milestones, find the perfect gesture here.
          </p>

          <div className="flex items-center justify-center gap-4 text-secondary mt-12 opacity-30">
            <div className="h-px w-24 bg-secondary" />
            <Sparkles className="w-6 h-6" />
            <div className="h-px w-24 bg-secondary" />
          </div>
        </div>
        
        {/* Occasion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {occasions.map((occasion) => (
            <OccasionCard key={occasion.id} occasion={occasion} />
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Global Delivery", desc: "Sending joy across all borders", icon: "🌍" },
            { title: "Premium Wrap", desc: "Luxury packaging for every gift", icon: "🎁" },
            { title: "Fast Shipping", desc: "Because moments can't wait", icon: "⚡" },
          ].map((item, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-sm text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-lg font-black text-charcoal mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
