"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "Search for gifts...", className = "" }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ai?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`relative group w-full max-w-2xl mx-auto ${className}`}
    >
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#caa161] transition-colors" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border-2 border-gray-100 rounded-[2rem] py-5 pl-16 pr-14 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-8 focus:ring-[#caa161]/5 focus:border-[#caa161]/30 transition-all shadow-xl shadow-gray-200/20"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}
