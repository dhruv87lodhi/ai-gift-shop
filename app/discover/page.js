'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Truck, Filter, ChevronLeft, Star, Heart, Flame, Navigation, Search, X, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockNearbyProducts = [
  { id: 'n1', name: 'Handmade Chocolate Gift Box', price: 599, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', seller: 'Sweet Surprise', distance: '1.2 km', deliveryTime: 'Same Day', rating: 4.8, reviews: 124, trending: true, category: 'Chocolates' },
  { id: 'n2', name: 'Personalized Photo Frame', price: 449, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400', seller: 'Frame It Up', distance: '2.5 km', deliveryTime: 'Same Day', rating: 4.6, reviews: 89, trending: false, category: 'Personalized' },
  { id: 'n3', name: 'Rose Bouquet with Teddy', price: 899, image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400', seller: 'Bloom & Gift', distance: '0.8 km', deliveryTime: 'Same Day', rating: 4.9, reviews: 256, trending: true, category: 'Flowers' },
  { id: 'n4', name: 'Custom Name Mug Set', price: 349, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', seller: 'MugCraft', distance: '3.1 km', deliveryTime: 'Next Day', rating: 4.5, reviews: 67, trending: false, category: 'Personalized' },
  { id: 'n5', name: 'Premium Gift Hamper', price: 1299, image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400', seller: 'Gift Galaxy', distance: '1.8 km', deliveryTime: 'Same Day', rating: 4.7, reviews: 198, trending: true, category: 'Hampers' },
  { id: 'n6', name: 'Scented Candle Set', price: 699, image: 'https://images.unsplash.com/photo-1602607715218-996f84e204c9?w=400', seller: 'Aroma World', distance: '4.2 km', deliveryTime: 'Next Day', rating: 4.4, reviews: 45, trending: false, category: 'Home Decor' },
  { id: 'n7', name: 'Rakhi Gift Combo', price: 799, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f0e1?w=400', seller: 'Festive Treats', distance: '2.0 km', deliveryTime: 'Same Day', rating: 4.8, reviews: 312, trending: true, category: 'Festival' },
  { id: 'n8', name: 'Customized Jewelry Box', price: 549, image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400', seller: 'Jewel Box Co', distance: '5.0 km', deliveryTime: 'Standard', rating: 4.3, reviews: 34, trending: false, category: 'Fashion' },
];

const distanceOptions = ['All', '< 2 km', '< 5 km', '< 10 km'];
const deliveryOptions = ['All', 'Same Day', 'Next Day', 'Standard'];
const priceOptions = ['All', 'Under ₹500', '₹500-₹1000', 'Above ₹1000'];
const categories = ['All', 'Chocolates', 'Flowers', 'Personalized', 'Hampers', 'Home Decor', 'Fashion', 'Festival'];

export default function DiscoverPage() {
  const [distanceFilter, setDistanceFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const toggleWish = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = mockNearbyProducts.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.seller.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (distanceFilter === '< 2 km' && parseFloat(p.distance) >= 2) return false;
    if (distanceFilter === '< 5 km' && parseFloat(p.distance) >= 5) return false;
    if (distanceFilter === '< 10 km' && parseFloat(p.distance) >= 10) return false;
    if (deliveryFilter !== 'All' && p.deliveryTime !== deliveryFilter) return false;
    if (priceFilter === 'Under ₹500' && p.price >= 500) return false;
    if (priceFilter === '₹500-₹1000' && (p.price < 500 || p.price > 1000)) return false;
    if (priceFilter === 'Above ₹1000' && p.price <= 1000) return false;
    return true;
  });

  const trendingProducts = mockNearbyProducts.filter(p => p.trending);
  const sameDayProducts = mockNearbyProducts.filter(p => p.deliveryTime === 'Same Day');

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-sm mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-widest">Local Discovery</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-charcoal">
                Gifts <span className="text-primary">Near You</span>
              </h1>
              <p className="text-gray-400 font-medium mt-2">Discover amazing gifts from local sellers in your area</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search nearby gifts..." className="pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary outline-none text-sm font-bold w-64" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl border-2 transition-all ${showFilters ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Distance</p>
                  <div className="flex flex-wrap gap-2">
                    {distanceOptions.map(opt => (
                      <button key={opt} onClick={() => setDistanceFilter(opt)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${distanceFilter === opt ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Delivery</p>
                  <div className="flex flex-wrap gap-2">
                    {deliveryOptions.map(opt => (
                      <button key={opt} onClick={() => setDeliveryFilter(opt)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${deliveryFilter === opt ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Price</p>
                  <div className="flex flex-wrap gap-2">
                    {priceOptions.map(opt => (
                      <button key={opt} onClick={() => setPriceFilter(opt)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${priceFilter === opt ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(opt => (
                      <button key={opt} onClick={() => setCategoryFilter(opt)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${categoryFilter === opt ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nearby Trending Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-charcoal">Nearby Trending Gifts</h2>
              <p className="text-xs font-bold text-gray-400">Popular picks from sellers within 5km</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {trendingProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="min-w-[280px] bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all">
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"><Flame className="w-3 h-3" /> Trending</span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-[10px] font-bold text-charcoal px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {product.distance}</span>
                  </div>
                  <button onClick={() => toggleWish(product.id)} className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{product.seller}</p>
                  <h3 className="font-bold text-charcoal text-sm mt-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-black text-secondary">₹{product.price}</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {product.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {product.deliveryTime === 'Same Day' && (
                      <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Same Day</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Same Day Delivery */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[2rem] p-8 border border-green-100 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-charcoal">⚡ Same-Day Delivery</h2>
                <p className="text-sm text-gray-500 font-medium">Order now, receive today from sellers near you</p>
              </div>
              <span className="ml-auto text-xs font-black text-green-600 bg-green-100 px-4 py-2 rounded-full">{sameDayProducts.length} sellers available</span>
            </div>
          </div>
        </section>

        {/* All Nearby Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-charcoal">All Nearby Gifts</h2>
                <p className="text-xs font-bold text-gray-400">{filtered.length} gifts found</p>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><MapPin className="w-7 h-7 text-gray-300" /></div>
              <p className="font-bold text-gray-400 mb-1">No gifts match your filters</p>
              <p className="text-xs text-gray-300 font-medium">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur text-[10px] font-bold text-charcoal px-2.5 py-1 rounded-full flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {product.distance}</span>
                    </div>
                    {product.deliveryTime === 'Same Day' && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Today</span>
                      </div>
                    )}
                    <button onClick={() => toggleWish(product.id)} className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{product.seller}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {product.rating}
                        <span className="text-gray-300">({product.reviews})</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-charcoal text-sm mt-1.5 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-black text-secondary">₹{product.price}</span>
                      <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-black hover:bg-primary hover:text-white transition-all">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
