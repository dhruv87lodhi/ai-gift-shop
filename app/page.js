import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import OccasionCard from "@/components/OccasionCard";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import { occasions, categories, products } from "@/data/mockData";

export default function Home() {
  const featuredOccasions = occasions.slice(0, 3);
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#111111] -z-10" />
        
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#caa161] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#b08a50] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float" style={{ animationDelay: '1s' }} />

        <div className="max-w-4xl mx-auto text-center z-10 animate-[fade-in-up_0.8s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium text-[#caa161]">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Gift Recommendations</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white">
            Find the Perfect Gift, <br className="hidden md:block" />
            <span className="text-gradient">Every Time.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Let our intelligent AI analyze your needs and suggest the most thoughtful presents for your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-[#caa161]/25 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Try AI Gift Finder
            </button>
            <Link href="/category" className="w-full sm:w-auto px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              Browse Categories
            </Link>
          </div>

          {/* Search Bar */}
          <form action="/search" className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#caa161] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search for gifts, categories, or occasions..."
              className="w-full pl-12 pr-4 py-4 bg-[#111] border border-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#caa161] focus:border-transparent transition-all shadow-lg text-lg"
              required
            />
            <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-[#caa161] hover:bg-[#b08a50] text-white font-bold rounded-full transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Occasions */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Shop by Occasion
          </h2>
          <Link href="/occasion" className="flex items-center gap-2 text-[#caa161] font-semibold hover:gap-3 transition-all">
            View All <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredOccasions.map((occasion) => (
            <OccasionCard key={occasion.id} occasion={occasion} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From tech gadgets to personalized experiences, we have curated the best gifts across all categories.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Gifts */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trending Gifts
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Chatbot Component (Floating) */}
      <Chatbot />
    </div>
  );
}
