import { categories } from "@/data/mockData";
import CategoryCard from "@/components/CategoryCard";
import Chatbot from "@/components/Chatbot";
import { Sparkles, Gift } from "lucide-react";

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6 text-sm font-bold text-primary animate-fade-in">
            <Sparkles className="w-4 h-4" />
            CURATED COLLECTIONS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-charcoal leading-tight tracking-tighter mb-6 animate-fade-in-up">
            Shop By <span className="text-primary italic">Category</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Explore our diverse ranges of thoughtful gifts, handpicked to ensure quality and joy for every recipient.
          </p>

          <div className="flex items-center justify-center gap-4 text-primary mt-12 opacity-30">
            <div className="h-px w-24 bg-primary" />
            <Gift className="w-6 h-6" />
            <div className="h-px w-24 bg-primary" />
          </div>
        </div>
        
        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-32 p-12 bg-charcoal rounded-[3rem] relative overflow-hidden text-center group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-4 italic">Still not sure?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Let our AI Assistant help you find the perfect gift based on your specific needs.</p>
            <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-white hover:text-charcoal transition-all shadow-xl shadow-primary/20">
              Start AI Chat
            </button>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
