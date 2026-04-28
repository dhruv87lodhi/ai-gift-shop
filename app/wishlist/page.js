'use client';

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { 
  Heart, ShoppingBag, ArrowLeft, ChevronLeft, Sparkles, 
  Share2, Trash2, Gift, Star, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "@/components/Chatbot";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
 
export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
 
  const moveAllToCart = () => {
    wishlist.forEach(item => {
      addToCart(item);
    });
    router.push('/cart?added=true');
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section (Matching Profile/Cart) */}
        <div className="mb-12 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-secondary font-bold text-sm mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-4xl md:text-5xl font-black text-charcoal">
              My <span className="text-secondary">Vault</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
              {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[3rem] border border-white/60 shadow-premium animate-fade-in">
            <div className="w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center mb-8 border border-secondary/20 animate-float">
              <Heart className="w-12 h-12 text-secondary" />
            </div>
            <h2 className="text-3xl font-black text-charcoal mb-4 uppercase tracking-tighter">Your vault is empty</h2>
            <p className="text-gray-400 mb-10 max-w-md font-medium text-lg">
              Found something you love? Save it here to keep track of your favorite gifts.
            </p>
            <Link href="/" className="px-10 py-5 bg-charcoal text-white rounded-2xl font-black text-lg transition-all hover:bg-secondary shadow-xl shadow-black/10 flex items-center gap-3">
              <Sparkles className="w-6 h-6" /> Start Exploring
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Sidebar: Wishlist Stats (Matching Profile Sidebar) */}
            <aside className="w-full lg:w-[320px] glass rounded-[2.5rem] border border-white/60 overflow-hidden shrink-0 shadow-premium animate-fade-in-up">
              <div className="p-10 border-b border-gray-100 bg-white/40">
                <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Heart className="w-10 h-10 text-secondary fill-secondary" />
                </div>
                <h2 className="text-2xl font-black text-charcoal mb-1 tracking-tight">Wishlist</h2>
                <p className="text-gray-400 text-sm font-medium">Your curated collection</p>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-gray-500 font-bold text-sm uppercase tracking-widest">
                      <Star className="w-5 h-5 text-secondary" />
                      <span>Top Choices</span>
                   </div>
                   <div className="flex items-center gap-4 text-gray-500 font-bold text-sm uppercase tracking-widest">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span>Recently Added</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <button 
                    onClick={() => {}} // Sharing logic
                    className="w-full py-4 bg-white border border-gray-100 text-charcoal rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    <Share2 className="w-5 h-5" /> Share Vault
                  </button>
                  
                  <button 
                    onClick={clearWishlist}
                    className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Content Area: Wishlist Items (Matching Profile Main Content) */}
            <main className="flex-1 space-y-10 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Top Shortcut Cards (Matching Profile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link 
                  href="/#trending-gifts"
                  className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-secondary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-secondary/20"
                >
                  <div className="relative z-10 text-left">
                    <h3 className="text-3xl font-black text-charcoal leading-none mb-3">Trending<br/><span className="text-secondary">Gifts</span></h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Top rated by community</p>
                  </div>
                  <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">
                     <Sparkles className="w-full h-full text-secondary/10 absolute -inset-2" />
                     <div className="w-full h-full bg-secondary/10 rounded-3xl flex items-center justify-center">
                       <Star className="w-12 h-12 text-secondary" />
                     </div>
                  </div>
                </Link>
 
                <div 
                  onClick={moveAllToCart}
                  className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-primary/20"
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-charcoal leading-none mb-3">Move to<br/><span className="text-primary">Cart</span></h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Add all items to bag</p>
                  </div>
                  <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                     <ShoppingBag className="w-full h-full text-primary/10 absolute -inset-2" />
                     <div className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center">
                       <ShoppingBag className="w-12 h-12 text-primary" />
                     </div>
                  </div>
                </div>
              </div>

              {/* Main Items Grid Container (Matching Profile Content Box) */}
              <div id="wishlist-grid" className="glass rounded-[3rem] p-8 md:p-14 border border-white/80 shadow-premium min-h-[600px] relative overflow-hidden scroll-mt-24">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div>
                      <h2 className="text-3xl font-black text-charcoal">Saved <span className="text-secondary">Favorites</span></h2>
                      <p className="text-gray-400 font-medium mt-1">Your curated selection of the perfect gifts.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {wishlist.map((item, index) => (
                        <motion.div
                          layout
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProductCard product={item} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  );
}
