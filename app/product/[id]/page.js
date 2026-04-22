"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import { products } from "@/data/mockData";
import Chatbot from "@/components/Chatbot";
import { useCart } from "@/context/CartContext";
import { useState, use } from "react";

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const product = products.find((p) => p.id === id) || products[0];
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#caa161] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass border border-white/5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#caa161]/20 text-[#caa161] w-max">
            {product.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-white mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-1 rounded-full bg-green-900/30 text-green-400">
                <Check className="w-4 h-4" />
              </div>
              <span>In stock and ready to ship</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-1 rounded-full bg-blue-900/30 text-blue-400">
                <Truck className="w-4 h-4" />
              </div>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-1 rounded-full bg-orange-900/30 text-orange-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>1-year premium warranty included</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#caa161]/20 flex items-center justify-center gap-2"
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
