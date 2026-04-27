"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import NoteGenerator from "@/components/NoteGenerator";
import Chatbot from "@/components/Chatbot";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 499 ? 0 : 49;
  const finalTotal = cartTotal + tax + shipping;

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto flex flex-col">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#caa161] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
            <span className="text-4xl opacity-50">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet. Let our AI help you find the perfect gift!
          </p>
          <Link href="/" className="px-8 py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] text-white rounded-xl font-bold transition-transform hover:scale-105 shadow-lg shadow-[#caa161]/20">
            Discover Gifts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 glass rounded-3xl border border-gray-200 items-center transition-all hover:shadow-lg">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.srcset = ""; }} />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-[#9a7638] uppercase tracking-wider font-semibold">{item.category}</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-2 border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-4 text-center text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors bg-gray-100 px-4 py-2 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Note Generator Step */}
            <div className="mt-16 border-t border-gray-200 pt-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Include a Personalized Note Card
                </h2>
                <p className="text-gray-500">
                  Generate a custom AI note and select a beautiful physical card theme to be delivered with your gifts.
                </p>
              </div>
              <NoteGenerator />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-3xl border border-gray-200 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-gray-900 font-medium">₹{Math.round(tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? <span className="text-[#9a7638]">Free</span> : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 italic">Free shipping on orders above ₹499</p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-extrabold text-[#9a7638]">₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#caa161]/20 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" /> Proceed to Checkout
              </Link>
              
              <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                Secure checkout powered by AuraGifts
              </p>
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}
