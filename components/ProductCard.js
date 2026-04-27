"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#caa161]/10 border border-gray-200">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80";
            e.currentTarget.srcset = "";
          }}
        />
        <button 
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 backdrop-blur-md rounded-full transition-all z-10 ${
            isWishlisted 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
            : 'bg-white/70 text-gray-400 hover:text-[#caa161] hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9a7638]">
            {product.category}
          </span>
          <span className="font-bold text-lg text-gray-900">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#9a7638] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {product.description}
        </p>
        <Link
          href={`/product/${product.id}`}
          className="block w-full py-2.5 px-4 bg-gray-900 text-white text-center font-bold rounded-xl hover:bg-[#caa161] hover:text-white transition-colors"
        >
          View Gift
        </Link>
      </div>
    </div>
  );
}
