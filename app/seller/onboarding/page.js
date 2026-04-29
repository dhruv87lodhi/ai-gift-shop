'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, MapPin, Truck, Package, ArrowRight, ArrowLeft, Check,
  Upload, Sparkles, Loader2, ChevronLeft, ShieldCheck, Zap, Gift
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Welcome', subtitle: 'Switch to Seller Mode', icon: Store },
  { id: 2, title: 'Shop Details', subtitle: 'Tell us about your shop', icon: Gift },
  { id: 3, title: 'First Product', subtitle: 'Optional — upload later', icon: Package },
  { id: 4, title: 'Delivery', subtitle: 'Set delivery options', icon: Truck },
];

export default function SellerOnboarding() {
  const { user, loading, setIsSeller, setSellerProfile, addSellerProduct } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef(null);

  const [shopData, setShopData] = useState({
    shopName: '', shopDescription: '', shopLogo: null,
    address: '', city: '', state: '', pincode: '',
  });

  const [productData, setProductData] = useState({
    name: '', description: '', price: '', category: 'General', image: null,
  });

  const [deliveryData, setDeliveryData] = useState({
    sameDay: false, nextDay: true, standard: true, freeAbove: '499',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary" />
    </div>
  );

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProductData(prev => ({ ...prev, image: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const generateDesc = async () => {
    if (!productData.name) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productData.name, category: productData.category }),
      });
      const data = await res.json();
      if (data.description) setProductData(prev => ({ ...prev, description: data.description }));
    } catch (err) { console.error(err); }
    finally { setGenerating(false); }
  };

  const completeOnboarding = () => {
    const profile = {
      shopName: shopData.shopName || `${user?.name}'s Gift Shop`,
      shopDescription: shopData.shopDescription,
      shopLogo: shopData.shopLogo,
      location: { address: shopData.address, city: shopData.city, state: shopData.state, pincode: shopData.pincode },
      deliveryOptions: { sameDay: deliveryData.sameDay, nextDay: deliveryData.nextDay, standard: deliveryData.standard, freeAbove: parseInt(deliveryData.freeAbove) || 499 },
      isVerified: false, rating: 0, totalSales: 0,
    };
    setSellerProfile(profile);
    setIsSeller(true);

    if (productData.name && productData.price) {
      addSellerProduct({
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        stock: 10,
        image: productData.image || 'https://placehold.co/400x400/f5f5f0/caa161?text=Gift',
        tags: [],
      });
    }
    router.push('/seller');
  };

  const canProceed = () => {
    if (currentStep === 2 && !shopData.shopName) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-[#faf5f0] pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-400 hover:text-secondary font-bold text-sm mb-8 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDone ? 'bg-green-500 text-white' : isActive ? 'seller-gradient text-white shadow-lg shadow-secondary/20' : 'bg-gray-100 text-gray-400'}`}>
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-black ${isActive ? 'text-secondary' : 'text-gray-400'}`}>{step.title}</p>
                    <p className="text-[10px] text-gray-300 font-medium">{step.subtitle}</p>
                  </div>
                  {i < steps.length - 1 && <div className={`hidden sm:block w-8 lg:w-16 h-0.5 mx-2 ${isDone ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full seller-gradient rounded-full transition-all duration-500" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100">

            {currentStep === 1 && (
              <div className="text-center space-y-8">
                <div className="w-20 h-20 seller-gradient rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-secondary/20">
                  <Store className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-charcoal">Become a Seller on <span className="seller-text-gradient">Giftora</span></h2>
                  <p className="text-gray-500 font-medium mt-3 max-w-md mx-auto leading-relaxed">Join thousands of gift sellers and reach millions of buyers. Set up your shop in under 2 minutes.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: <Zap className="w-6 h-6 text-primary" />, title: 'Easy Setup', desc: 'Launch in minutes' },
                    { icon: <Sparkles className="w-6 h-6 text-secondary" />, title: 'AI Powered', desc: 'Smart tools & insights' },
                    { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, title: 'Secure', desc: 'Safe payments' },
                  ].map((f, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">{f.icon}</div>
                      <p className="font-black text-charcoal text-sm">{f.title}</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-charcoal">Shop Details</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">Tell buyers about your gift shop</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Shop Name *</label>
                  <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-bold text-charcoal" placeholder="e.g. Priya's Gift Corner" value={shopData.shopName} onChange={e => setShopData({ ...shopData, shopName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Shop Description</label>
                  <textarea rows={3} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-bold text-charcoal resize-none" placeholder="What makes your shop special?" value={shopData.shopDescription} onChange={e => setShopData({ ...shopData, shopDescription: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">City</label>
                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary outline-none font-bold text-charcoal" placeholder="Mumbai" value={shopData.city} onChange={e => setShopData({ ...shopData, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">State</label>
                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary outline-none font-bold text-charcoal" placeholder="Maharashtra" value={shopData.state} onChange={e => setShopData({ ...shopData, state: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pincode</label>
                  <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary outline-none font-bold text-charcoal" placeholder="400001" value={shopData.pincode} onChange={e => setShopData({ ...shopData, pincode: e.target.value })} />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-black text-charcoal">Upload First Product</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">Optional — you can skip and add later</p>
                </div>
                <div className="drop-zone p-8 text-center cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {productData.image ? (
                    <img src={productData.image} alt="Preview" className="w-32 h-32 object-cover rounded-2xl mx-auto shadow-lg" />
                  ) : (
                    <div className="space-y-3">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto"><Upload className="w-6 h-6 text-primary" /></div>
                      <p className="font-bold text-gray-500 text-sm">Drop image or click to upload</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                  <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary outline-none font-bold text-charcoal" placeholder="e.g. Handmade Birthday Gift Box" value={productData.name} onChange={e => setProductData({ ...productData, name: e.target.value })} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                    <input type="number" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary outline-none font-bold text-charcoal" placeholder="499" value={productData.price} onChange={e => setProductData({ ...productData, price: e.target.value })} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                    <select className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-charcoal appearance-none" value={productData.category} onChange={e => setProductData({ ...productData, category: e.target.value })}>
                      {['General','Personalized','Chocolates','Flowers','Hampers','Home Decor','Fashion','Tech','Handmade'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {productData.name && (
                  <button onClick={generateDesc} disabled={generating} className="w-full py-3 bg-secondary/10 text-secondary rounded-xl font-bold text-sm hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> AI Generate Description</>}
                  </button>
                )}
                {productData.description && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-charcoal font-medium leading-relaxed">{productData.description}</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-charcoal">Delivery Options</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">How will you deliver gifts?</p>
                </div>
                {[
                  { key: 'sameDay', label: 'Same-Day Delivery', desc: 'Deliver within hours — buyers love it!', emoji: '⚡' },
                  { key: 'nextDay', label: 'Next-Day Delivery', desc: 'Deliver by next business day', emoji: '📦' },
                  { key: 'standard', label: 'Standard Delivery', desc: '3-5 business days', emoji: '🚚' },
                ].map(opt => (
                  <div key={opt.key} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${deliveryData[opt.key] ? 'border-secondary bg-secondary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`} onClick={() => setDeliveryData(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div className="flex-1">
                        <p className="font-black text-charcoal">{opt.label}</p>
                        <p className="text-xs text-gray-400 font-medium">{opt.desc}</p>
                      </div>
                      <div className={`seller-toggle ${deliveryData[opt.key] ? 'active' : ''}`} />
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Free Delivery Above (₹)</label>
                  <input type="number" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary outline-none font-bold text-charcoal" placeholder="499" value={deliveryData.freeAbove} onChange={e => setDeliveryData({ ...deliveryData, freeAbove: e.target.value })} />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              {currentStep > 1 ? (
                <button onClick={() => setCurrentStep(prev => prev - 1)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button onClick={() => setCurrentStep(prev => prev + 1)} disabled={!canProceed()} className="px-8 py-4 seller-gradient text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2 disabled:opacity-40">
                  {currentStep === 3 ? (productData.name ? 'Next' : 'Skip') : 'Continue'} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={completeOnboarding} className="px-10 py-4 seller-gradient text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2">
                  <Check className="w-5 h-5" /> Launch My Shop
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
