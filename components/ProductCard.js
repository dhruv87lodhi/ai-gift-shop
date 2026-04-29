"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, Star, View, ShoppingCart, Minus, Plus, Trash2, Sparkles } from "lucide-react";
import { hasARSupport } from "@/components/ARViewer";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // Get current quantity in cart
  const cartItem = cartItems.find((item) => String(item.id) === String(product.id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Mock rating if not present
  const rating = product.rating || 4.5;
  // Use a deterministic "random" number based on ID to avoid hydration mismatch
  const reviews = product.reviews || (30 + (product.id % 170));

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
        {hasARSupport(product.id) && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
            <View className="w-3 h-3" /> 3D
          </div>
        )}
        {product.matchPercentage && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 fill-current" /> {product.matchPercentage}% Match
          </div>
        )}
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
        
        <div className="flex gap-2 mt-4">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 py-3 px-4 bg-gray-50 text-charcoal text-center font-bold text-sm rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300"
          >
            View Details
          </Link>

          {quantityInCart > 0 ? (
            <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (quantityInCart <= 1) {
                    removeFromCart(product.id);
                  } else {
                    updateQuantity(product.id, quantityInCart - 1);
                  }
                }}
                className="p-3 hover:bg-gray-200 transition-colors text-gray-700"
              >
                {quantityInCart <= 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
              </button>
              <span className="px-2 font-bold text-sm text-gray-900 min-w-[28px] text-center">
                {quantityInCart}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, quantityInCart + 1);
                }}
                className="p-3 hover:bg-gray-200 transition-colors text-gray-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
