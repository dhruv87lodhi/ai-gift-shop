'use client';

import { useState } from 'react';

const generateDailySales = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fixedSales = [4500, 3200, 5800, 4100, 6200, 8500, 7200];
  const fixedOrders = [12, 8, 15, 11, 14, 22, 18];
  return days.map((day, i) => ({
    day,
    sales: fixedSales[i],
    orders: fixedOrders[i],
  }));
};

const generateTopProducts = () => [
  { name: 'Classic Red Rose Bouquet', views: 542, sales: 88, conversion: 16 },
  { name: 'Belgium Chocolate Truffle Cake', views: 489, sales: 75, conversion: 15 },
  { name: 'Personalized LED Photo Frame', views: 426, sales: 62, conversion: 14 },
  { name: 'Wireless Noise Cancelling Pods', views: 398, sales: 52, conversion: 13 },
  { name: 'Customized Wooden Name Plaque', views: 367, sales: 49, conversion: 13 },
];

function BarChart({ data, height = 200 }) {
  const maxSales = Math.max(...data.map(d => d.sales));
  return (
    <div className="w-full">
      <div className="relative" style={{ height: `${height}px` }}>
        {[0, 25, 50, 75, 100].map(pct => (
          <div key={pct} className="absolute w-full border-t border-gray-100" style={{ bottom: `${pct}%` }}>
            <span className="absolute -left-12 -top-2.5 text-[10px] font-bold text-gray-300 w-10 text-right">
              {Math.round((maxSales * pct) / 100 / 100) * 100}
            </span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end justify-around px-2">
          {data.map((item, idx) => {
            const barHeight = (item.sales / maxSales) * 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 group" style={{ width: '12%' }}>
                <div className="relative w-full max-w-[40px]">
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 shadow-xl">
                    ₹{item.sales.toLocaleString()} • {item.orders} orders
                  </div>
                  <div className="chart-bar w-full rounded-t-xl bg-gradient-to-t from-secondary to-secondary/60 group-hover:from-primary group-hover:to-primary/60 transition-colors cursor-pointer" style={{ height: `${barHeight}%`, minHeight: '8px', animationDelay: `${idx * 0.1}s` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-around mt-3 px-2">
        {data.map((item, idx) => (
          <span key={idx} className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{item.day}</span>
        ))}
      </div>
    </div>
  );
}

function GaugeChart({ value, maxValue = 100, label, color = '#7a1a1a' }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / maxValue) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="gauge-circle" transform="rotate(-90 60 60)" />
        <text x="60" y="55" textAnchor="middle" fill="#1a1a1a" fontSize="22" fontWeight="900">{value}%</text>
        <text x="60" y="75" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="700">{label}</text>
      </svg>
    </div>
  );
}

function InventoryAlert({ product, stock, type }) {
  const colors = { critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', dot: 'bg-red-500' }, low: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', dot: 'bg-amber-500' }, ok: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', dot: 'bg-green-500' } };
  const c = colors[type] || colors.ok;
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-4 flex items-center gap-4`}>
      <div className={`w-3 h-3 rounded-full ${c.dot} pulse-dot`} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-charcoal text-sm truncate">{product}</p>
        <p className={`text-xs font-bold ${c.text}`}>{stock} units left</p>
      </div>
    </div>
  );
}

export function DashboardOverview({ products = [] }) {
  const [salesData] = useState(generateDailySales);
  const [topProducts] = useState(generateTopProducts);
  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const maxViews = Math.max(...topProducts.map(p => p.views));
  const inventoryAlerts = [
    { product: 'Handmade Gift Box', stock: 3, type: 'critical' },
    { product: 'Chocolate Hamper', stock: 8, type: 'low' },
    { product: 'Rose Bouquet Set', stock: 25, type: 'ok' },
    { product: 'Personalized Mug', stock: 5, type: 'low' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Sales', value: `₹${totalSales.toLocaleString()}`, change: '+12%', icon: '💰' },
          { label: 'Total Orders', value: totalOrders, change: '+8%', icon: '📦' },
          { label: 'Products Listed', value: products.length || 12, change: '+2', icon: '🏷️' },
          { label: 'Avg. Rating', value: '4.6', change: '+0.2', icon: '⭐' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-[10px] font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full">{card.change}</span>
            </div>
            <p className="text-2xl font-black text-charcoal">{card.value}</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-charcoal">Daily Sales</h3>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Last 7 days</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-charcoal">₹{totalSales.toLocaleString()}</p>
              <p className="text-xs font-bold text-green-500">↑ 12% vs last week</p>
            </div>
          </div>
          <BarChart data={salesData} height={180} />
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
          <h3 className="text-lg font-black text-charcoal mb-2">Conversion</h3>
          <p className="text-xs font-bold text-gray-400 mb-6">Visitors to buyers</p>
          <div className="flex justify-center"><GaugeChart value={13} label="Rate" color="#7a1a1a" /></div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm"><span className="font-bold text-gray-500">Visitors</span><span className="font-black text-charcoal">2,847</span></div>
            <div className="flex justify-between text-sm"><span className="font-bold text-gray-500">Buyers</span><span className="font-black text-charcoal">370</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
          <h3 className="text-lg font-black text-charcoal mb-1">Most Viewed Products</h3>
          <p className="text-xs font-bold text-gray-400 mb-6">Top performing items</p>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-charcoal truncate max-w-[180px]">{p.name}</span>
                  <span className="text-sm font-black text-gray-500">{p.views}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full progress-bar" style={{ width: `${(p.views / maxViews) * 100}%`, background: i === 0 ? '#7a1a1a' : i === 1 ? '#caa161' : '#d1d5db' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100">
          <h3 className="text-lg font-black text-charcoal mb-1">Inventory Alerts</h3>
          <p className="text-xs font-bold text-gray-400 mb-6">Needs restocking</p>
          <div className="space-y-3">
            {inventoryAlerts.map((alert, i) => (<InventoryAlert key={i} {...alert} />))}
          </div>
        </div>
      </div>
    </div>
  );
}
