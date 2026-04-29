'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Sparkles, MessageCircle, IndianRupee,
  Plus, Edit2, Trash2, Eye, ChevronLeft, Store, ShoppingBag,
  TrendingUp, AlertCircle, Search
} from 'lucide-react';
import { DashboardOverview } from '@/components/seller/SellerDashboardCharts';
import ProductUploadModal from '@/components/seller/ProductUploadModal';
import SellerAIAssistant from '@/components/seller/SellerAIAssistant';
import SellerChat from '@/components/seller/SellerChat';
import PricingTools from '@/components/seller/PricingTools';

export default function SellerDashboard() {
  const { user, loading, isSeller, sellerProfile, sellerProducts, addSellerProduct, deleteSellerProduct } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchProducts, setSearchProducts] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && !sellerProfile) router.push('/seller/onboarding');
  }, [loading, user, sellerProfile, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary" />
    </div>
  );

  if (!user || !sellerProfile) return null;

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'pricing', label: 'Pricing Tools', icon: IndianRupee },
  ];

  const filteredProducts = sellerProducts.filter(p =>
    p.name?.toLowerCase().includes(searchProducts.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview products={sellerProducts} />;
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-charcoal">Your Products</h3>
                <p className="text-xs font-bold text-gray-400 mt-1">{sellerProducts.length} products listed</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type="text" value={searchProducts} onChange={e => setSearchProducts(e.target.value)} placeholder="Search products..." className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary outline-none text-sm font-bold" />
                </div>
                <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 seller-gradient text-white rounded-xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2 whitespace-nowrap">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Package className="w-7 h-7 text-gray-300" />
                </div>
                <p className="font-bold text-gray-400 mb-2">No products yet</p>
                <button onClick={() => setShowUploadModal(true)} className="text-secondary font-black text-sm hover:underline">Add your first product →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:shadow-secondary/5 transition-all">
                    <div className="relative h-48 bg-gray-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex gap-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{product.status}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-charcoal text-sm truncate">{product.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-black text-secondary">₹{product.price?.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-gray-400">Stock: {product.stock}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {product.views || 0}</span>
                        <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {product.sales || 0}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => deleteSellerProduct(product.id)} className="py-2.5 px-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'ai-assistant':
        return <SellerAIAssistant />;
      case 'orders':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-charcoal">Incoming Orders</h3>
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShoppingBag className="w-7 h-7 text-gray-300" />
              </div>
              <p className="font-bold text-gray-400 mb-1">No orders yet</p>
              <p className="text-xs text-gray-300 font-medium">Orders will appear here when buyers purchase your products</p>
            </div>
          </div>
        );
      case 'messages':
        return <SellerChat />;
      case 'pricing':
        return <PricingTools />;
      default:
        return <DashboardOverview products={sellerProducts} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-secondary font-bold text-sm mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Shop
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 seller-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-charcoal">
                  {sellerProfile.shopName || 'My Shop'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="seller-badge">Seller</span>
                  <span className="text-xs font-bold text-gray-400">{sellerProfile.location?.city || 'India'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-[260px] glass rounded-[2rem] border border-white/60 overflow-hidden shrink-0 shadow-premium animate-fade-in-up">
            <nav className="p-3 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id ? 'seller-gradient text-white shadow-lg shadow-secondary/20' : 'text-gray-500 hover:bg-white hover:text-secondary hover:shadow-md'}`}>
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    {tab.id === 'messages' && <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">2</span>}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-white/80 shadow-premium min-h-[600px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="relative z-10">
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <ProductUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onSave={addSellerProduct} />
    </div>
  );
}
