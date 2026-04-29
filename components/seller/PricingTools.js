'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, IndianRupee, Loader2, BarChart3, Target } from 'lucide-react';

export default function PricingTools() {
  const [costPrice, setCostPrice] = useState('');
  const [marginPercent, setMarginPercent] = useState('40');
  const [productForPrice, setProductForPrice] = useState('');
  const [aiPrice, setAiPrice] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const sellingPrice = costPrice ? Math.round(parseFloat(costPrice) * (1 + parseFloat(marginPercent || 0) / 100)) : 0;
  const profitPerUnit = sellingPrice - (parseFloat(costPrice) || 0);
  const gstAmount = Math.round(sellingPrice * 0.18);

  const competitorData = [
    { seller: 'GiftKart', product: 'Gift Box Hamper', price: 699, rating: 4.2 },
    { seller: 'FlowerAura', product: 'Premium Gift Set', price: 899, rating: 4.5 },
    { seller: 'FNP', product: 'Luxury Hamper', price: 1299, rating: 4.7 },
    { seller: 'IGP', product: 'Birthday Gift Box', price: 549, rating: 4.0 },
    { seller: 'Winni', product: 'Celebration Box', price: 799, rating: 4.3 },
  ];

  const getAIPrice = async () => {
    if (!productForPrice.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/seller-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Suggest the ideal selling price for "${productForPrice}" on an Indian gift shop platform. Consider market rates, competitor prices, and perceived value. Give me: 1) Recommended price range in ₹ 2) Budget version price 3) Premium version price 4) Brief pricing strategy tip`,
          context: 'Seller asking for pricing recommendation',
        }),
      });
      const data = await res.json();
      setAiPrice(data.response);
    } catch (err) {
      setAiPrice('Could not get pricing suggestion. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-charcoal">Pricing & Profit Tools</h3>
          <p className="text-xs font-bold text-gray-400">Calculate profits and get AI pricing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Calculator */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-primary" />
            <h4 className="font-black text-charcoal">Profit Calculator</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cost Price (₹)</label>
              <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="e.g. 300" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-charcoal" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Margin (%)</label>
              <div className="flex gap-2">
                {['20', '30', '40', '50', '60'].map(m => (
                  <button key={m} onClick={() => setMarginPercent(m)} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${marginPercent === m ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{m}%</button>
                ))}
              </div>
            </div>

            {costPrice && (
              <div className="mt-6 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-6 space-y-4 border border-secondary/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">Selling Price</span>
                  <span className="text-2xl font-black text-charcoal">₹{sellingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">Profit per Unit</span>
                  <span className="text-lg font-black text-green-600">+₹{profitPerUnit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">GST (18%)</span>
                  <span className="text-sm font-black text-gray-400">₹{gstAmount}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">Final Price (incl. GST)</span>
                  <span className="text-xl font-black text-secondary">₹{(sellingPrice + gstAmount).toLocaleString()}</span>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">10 units</p>
                    <p className="text-sm font-black text-charcoal">₹{(profitPerUnit * 10).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">50 units</p>
                    <p className="text-sm font-black text-charcoal">₹{(profitPerUnit * 50).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">100 units</p>
                    <p className="text-sm font-black text-charcoal">₹{(profitPerUnit * 100).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Price Suggestion */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h4 className="font-black text-charcoal">AI Price Suggestion</h4>
            </div>

            <div className="space-y-4">
              <input type="text" value={productForPrice} onChange={e => setProductForPrice(e.target.value)} placeholder="e.g. Handmade gift box with chocolates" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-bold text-charcoal text-sm" />
              <button onClick={getAIPrice} disabled={aiLoading || !productForPrice.trim()} className="w-full py-4 seller-gradient text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-40 flex items-center justify-center gap-2">
                {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing market...</> : <><Target className="w-4 h-4" /> Get Recommended Price</>}
              </button>

              {aiPrice && (
                <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/10">
                  <p className="text-sm font-medium text-charcoal whitespace-pre-wrap leading-relaxed">{aiPrice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Competitor Prices */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4 className="font-black text-charcoal">Market Prices</h4>
            </div>
            <div className="space-y-3">
              {competitorData.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{comp.seller}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{comp.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-charcoal">₹{comp.price}</p>
                    <p className="text-[10px] text-primary font-bold">⭐ {comp.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
