import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import { products } from "@/data/mockData";

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  
  // Basic search filter: check if query matches product name, description, or category
  const lowerQuery = query.toLowerCase();
  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto flex flex-col">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#caa161] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Search Results
        </h1>
        <p className="text-gray-500 text-lg">
          Showing results for <span className="text-[#9a7638] font-semibold">"{query}"</span>
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            We couldn't find any gifts matching your search. Try using different keywords or browsing our categories.
          </p>
          <Link href="/category" className="px-8 py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] text-white rounded-xl font-bold transition-transform hover:scale-105 shadow-lg shadow-[#caa161]/20">
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Chatbot />
    </div>
  );
}
