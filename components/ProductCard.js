"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Mock rating if not present
  const rating = product.rating || 4.5;
  const reviews = product.reviews || Math.floor(Math.random() * 200) + 50;

  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border border-gray-100">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80";
            e.currentTarget.srcset = "";
          }}
        />
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all z-10 ${
            isWishlisted 
            ? 'bg-secondary text-white shadow-lg' 
            : 'bg-white/90 text-gray-400 hover:text-secondary hover:bg-white shadow-sm'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-charcoal text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="font-black text-xl text-charcoal mb-3">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </p>
        
        <div className="flex items-center gap-1 mt-auto">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">({reviews})</span>
        </div>
        
        <Link
          href={`/product/${product.id}`}
          className="mt-4 w-full py-3 px-4 bg-gray-50 text-charcoal text-center font-bold text-sm rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
