"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Sparkles, Gift, ArrowLeft, Loader2, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import { categories } from "@/data/mockData";
import CategoryCard from "@/components/CategoryCard";

function CategoryContent() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryName) {
      fetchRecommendations();
    }
  }, [categoryName]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/recommend?query=${encodeURIComponent(categoryName)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.recommendations || []);
      } else {
        setError("Failed to fetch recommendations");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Service is currently offline. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!categoryName) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6 text-sm font-bold text-primary animate-fade-in">
              <Sparkles className="w-4 h-4" />
              CURATED COLLECTIONS
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-charcoal leading-tight tracking-tighter mb-6 animate-fade-in-up">
              Shop By <span className="text-primary italic">Category</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Explore our diverse ranges of thoughtful gifts, handpicked to ensure quality and joy for every recipient.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <Link href="/category" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-bold mb-8 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            Back to Categories
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4 text-xs font-bold text-primary">
                <Search className="w-3 h-3" />
                AI RECOMMENDED
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-charcoal">
                {categoryName}
              </h1>
            </div>
            <p className="text-gray-500 font-medium md:max-w-md text-lg">
              Our AI has analyzed thousands of products to find the best <span className="text-primary font-bold">{categoryName}</span> for you.
            </p>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-400 font-bold animate-pulse">Consulting our AI Gift Expert...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-primary/5">
            <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-8">{error}</p>
            <button onClick={fetchRecommendations} className="px-8 py-3 bg-primary text-white rounded-full font-bold">
              Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <Gift className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-charcoal mb-2">No products found</h3>
            <p className="text-gray-500">Try searching for a different category or exploring our collections.</p>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
