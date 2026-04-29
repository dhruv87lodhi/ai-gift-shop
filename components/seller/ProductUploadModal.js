'use client';

import { useState, useRef } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, Loader2, Package, Tag, IndianRupee, Layers, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductUploadModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: '', description: '', category: 'General', price: '', stock: '10', tags: '',
  });

  const categories = ['General', 'Personalized', 'Chocolates', 'Flowers', 'Hampers', 'Home Decor', 'Fashion', 'Tech', 'Handmade', 'Cards'];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const processImage = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) processImage(file);
  };

  const generateDescription = async () => {
    if (!form.name) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: form.name, category: form.category, keywords: form.tags }),
      });
      const data = await res.json();
      if (data.description) {
        setForm(prev => ({ ...prev, description: data.description }));
      }
    } catch (err) {
      console.error('Failed to generate description:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    const product = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      image: imagePreview || 'https://placehold.co/400x400/f5f5f0/caa161?text=Gift',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    onSave(product);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setForm({ name: '', description: '', category: 'General', price: '', stock: '10', tags: '' });
    setImagePreview(null);
    setImageFile(null);
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-black text-charcoal">Add Product</h2>
              <p className="text-sm font-bold text-gray-400 mt-1">Step {step} of 2</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
          </div>

          {/* Progress */}
          <div className="px-8 pt-4">
            <div className="flex gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-secondary' : 'bg-gray-200'}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-secondary' : 'bg-gray-200'}`} />
            </div>
          </div>

          <div className="p-8 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Image Upload */}
                <div className={`drop-zone p-8 text-center cursor-pointer ${dragging ? 'dragging' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-2xl mx-auto shadow-lg" />
                      <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Upload className="w-7 h-7 text-primary" /></div>
                      <p className="font-bold text-charcoal">Drop image here or click to upload</p>
                      <p className="text-xs text-gray-400 font-medium">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Package className="w-3.5 h-3.5" /> Product Name</label>
                  <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-charcoal" placeholder="e.g. Handmade Birthday Gift Box" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Category</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none font-bold text-charcoal appearance-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><IndianRupee className="w-3.5 h-3.5" /> Price (₹)</label>
                    <input type="number" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-charcoal" placeholder="499" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Package className="w-3.5 h-3.5" /> Stock</label>
                    <input type="number" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-charcoal" placeholder="10" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!form.name || !form.price} className="w-full py-4 bg-charcoal text-white rounded-2xl font-black text-sm hover:bg-secondary transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed">Continue to Description</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* AI Description Generator */}
                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-6 border border-secondary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5 text-secondary" /></div>
                    <div>
                      <p className="font-black text-charcoal text-sm">AI Description Generator</p>
                      <p className="text-xs text-gray-400 font-medium">Let AI write a compelling description</p>
                    </div>
                    <button onClick={generateDescription} disabled={generating || !form.name} className="ml-auto px-5 py-2.5 bg-secondary text-white rounded-xl font-bold text-xs hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                      {generating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</> : <><Sparkles className="w-3.5 h-3.5" /> Generate</>}
                    </button>
                  </div>
                  {form.name && <p className="text-xs text-gray-500 font-medium bg-white/50 rounded-lg px-3 py-2">Will generate for: &quot;{form.name}&quot; in {form.category}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Description</label>
                  <textarea rows={5} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-charcoal resize-none" placeholder="Describe your product or use AI to generate..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Tags (comma separated)</label>
                  <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-charcoal" placeholder="birthday, handmade, gift box" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">Back</button>
                  <button onClick={handleSubmit} disabled={!form.name || !form.price} className="flex-1 py-4 seller-gradient text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-secondary/20 disabled:opacity-40">Add Product</button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
