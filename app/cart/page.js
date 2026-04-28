"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Trash2, Plus, Minus, CreditCard, Sparkles, MessageSquare, 
  CheckCircle2, X, Gift, ShieldCheck, Truck, ChevronLeft,
  ShoppingBag, Clock, Wallet
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import NoteGenerator from "@/components/NoteGenerator";
import Chatbot from "@/components/Chatbot";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
 
export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartContent />
    </Suspense>
  );
}
 
function CartContent() {
  const { cartItems = [], updateQuantity, removeFromCart, cartTotal = 0, giftNote } = useCart();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
 
  useEffect(() => {
    if (searchParams.get('added') === 'true') {
      setShowAddedToast(true);
      const timer = setTimeout(() => {
        setShowAddedToast(false);
        // Clean up URL
        router.replace('/cart', { scroll: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);
  
  const tax = (cartTotal || 0) * 0.08;
  const shipping = (cartTotal || 0) > 499 ? 0 : 49;
  const finalTotal = (cartTotal || 0) + tax + shipping;

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section (Matching Profile) */}
        <div className="mb-12 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-sm mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-charcoal">
            My <span className="text-primary">Shopping Bag</span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[3rem] border border-white/60 shadow-premium animate-fade-in">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 animate-float">
              <Gift className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-charcoal mb-4 uppercase tracking-tighter">Your bag is empty</h2>
            <p className="text-gray-400 mb-10 max-w-md font-medium text-lg">
              Looks like you haven't added anything to your cart yet. Let our AI help you find the perfect gift!
            </p>
            <Link href="/" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center gap-3">
              <Sparkles className="w-6 h-6" /> Discover Gifts
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Sidebar: Summary (Matching Profile Sidebar) */}
            <aside className="w-full lg:w-[360px] glass rounded-[2.5rem] border border-white/60 overflow-hidden shrink-0 shadow-premium animate-fade-in-up">
              <div className="p-10 border-b border-gray-100 bg-white/40">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <ShoppingBag className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-charcoal mb-1 tracking-tight">Order Summary</h2>
                <p className="text-gray-400 text-sm font-medium">{cartItems.length} items in your bag</p>
              </div>

              <div className="p-10 space-y-6">
                <div className="space-y-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-charcoal">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tax (8%)</span>
                    <span className="text-charcoal">₹{Math.round(tax).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-charcoal">
                      {shipping === 0 ? <span className="text-green-500">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1">Total Amount</span>
                    <span className="text-4xl font-black text-charcoal tracking-tighter">₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
                  </div>

                  <Link 
                    href="/checkout"
                    className="w-full py-6 bg-charcoal text-white rounded-2xl font-black text-lg tracking-tighter transition-all hover:bg-primary shadow-2xl hover:shadow-primary/20 flex items-center justify-center gap-3 group mb-6"
                  >
                    <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Checkout Now
                  </Link>
                  
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Secure Payments by Giftora</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Content Area: Cart Items (Matching Profile Main Content) */}
            <main className="flex-1 space-y-10 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Top Shortcut Cards (Matching Profile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-primary/20"
                  onClick={() => setShowNoteModal(true)}
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-charcoal leading-none mb-3">AI Gift<br/><span className="text-primary">Note</span></h3>
                    <p className={`text-sm font-bold uppercase tracking-wider ${giftNote ? 'text-green-500' : 'text-gray-400'}`}>{giftNote ? 'Message Attached' : 'Add a Message'}</p>
                  </div>
                  <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">
                     <Sparkles className="w-full h-full text-primary/10 absolute -inset-2" />
                     <div className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center">
                       <MessageSquare className={`w-12 h-12 ${giftNote ? 'text-primary' : 'text-primary/40'}`} />
                     </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-gray-100">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-charcoal leading-none mb-3">Safe<br/><span className="text-gray-400">Delivery</span></h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Hassle-free shipping</p>
                  </div>
                  <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                     <Truck className="w-full h-full text-gray-100 absolute -inset-2" />
                     <div className="w-full h-full bg-gray-50 rounded-3xl flex items-center justify-center">
                       <ShieldCheck className="w-12 h-12 text-gray-300" />
                     </div>
                  </div>
                </div>
              </div>

              {/* Main Items Container (Matching Profile Content Box) */}
              <div className="glass rounded-[3rem] p-8 md:p-14 border border-white/80 shadow-premium min-h-[600px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div>
                      <h2 className="text-3xl font-black text-charcoal">Selected <span className="text-primary">Gifts</span></h2>
                      <p className="text-gray-400 font-medium mt-1">Review and manage items before checkout.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {cartItems.map((item) => (
                      <motion.div 
                        layout
                        key={item.id} 
                        className="p-8 bg-[#fff8f8] rounded-[2.5rem] border border-white/80 flex flex-col md:flex-row items-center gap-8 group transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5"
                      >
                        <div className="relative w-32 h-32 rounded-[1.5rem] overflow-hidden bg-white shadow-md flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; }} />
                        </div>
                        
                        <div className="flex-1 w-full text-center md:text-left">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{item.category}</p>
                          <h4 className="text-xl font-black text-charcoal leading-tight mb-2">{item.name}</h4>
                          <p className="text-2xl font-black text-charcoal tracking-tight">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex items-center gap-6 bg-white rounded-2xl px-6 py-3 border border-gray-100 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-black text-lg text-charcoal min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                           <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-4 text-gray-300 hover:text-secondary hover:bg-secondary/5 rounded-2xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Note Generator Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNoteModal(false)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-6xl bg-ivory rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white/40 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-charcoal uppercase tracking-tighter">AI Note Studio</h2>
                </div>
                <button 
                  onClick={() => setShowNoteModal(false)}
                  className="p-3 bg-white rounded-full shadow-md text-gray-400 hover:text-charcoal transition-all hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar">
                <NoteGenerator />
              </div>

              <div className="p-8 border-t border-gray-100 flex justify-center bg-white/40 backdrop-blur-md">
                <button 
                  onClick={() => setShowNoteModal(false)}
                  className="px-16 py-5 bg-charcoal text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:shadow-primary/20"
                >
                  Finalize & Update Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Chatbot />
 
      {/* Added to Cart Toast */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] bg-charcoal text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md"
          >
            <div className="bg-green-500 p-1.5 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest">Added to cart successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
