'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User as UserIcon, 
  Package, 
  Heart, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut, 
  Edit2,
  ChevronRight,
  Gift,
  Plus,
  Lock,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Target,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#caa161]"></div>
    </div>
  );
  
  if (!user) return null;

  const tabs = [
    { id: 'personal', label: 'Identity', icon: UserIcon },
    { id: 'orders', label: 'Purchase History', icon: Package },
    { id: 'wishlist', label: 'Treasures', icon: Heart },
    { id: 'addresses', label: 'Locations', icon: MapPin },
    { id: 'reminders', label: 'Celebrations', icon: Bell },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo user={user} />;
      case 'orders':
        return <Orders orders={user.orders || []} />;
      case 'wishlist':
        return <Wishlist wishlist={user.wishlist || []} />;
      case 'addresses':
        return <Addresses addresses={user.addresses || []} />;
      case 'reminders':
        return <Reminders reminders={user.giftReminders || []} />;
      case 'settings':
        return <SettingsSection logout={logout} />;
      default:
        return <PersonalInfo user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden pb-20">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#caa161]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#b08a50]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Glass Profile Header */}
        <div className="glass rounded-[2.5rem] p-8 md:p-12 mb-10 border border-white/50 shadow-2xl shadow-[#caa161]/5 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-[#caa161] to-[#b08a50] flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white">
              {user.name[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user.name}</h1>
              <span className="inline-flex px-3 py-1 bg-[#caa161]/10 text-[#9a7638] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#caa161]/20">
                Verified Profile
              </span>
            </div>
            <p className="text-gray-500 font-medium">{user.email}</p>
          </div>

          <div className="flex gap-4">
            <Link href="/cart" className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-2xl font-bold transition-all shadow-lg shadow-black/5 hover:shadow-black/10 hover:-translate-y-0.5">
              <ShoppingBag className="w-4 h-4 text-[#caa161]" /> Cart
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-bold transition-all hover:bg-red-100">
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Vertical Sidebar - Artisan Style */}
          <aside className="lg:col-span-3">
            <div className="glass rounded-[2.5rem] p-4 border border-white/50 shadow-xl shadow-black/5 sticky top-28">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative group ${
                      activeTab === tab.id 
                      ? 'bg-gray-900 text-white shadow-xl shadow-black/20 translate-x-2' 
                      : 'text-gray-400 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-[#caa161]/20' : 'bg-gray-50 group-hover:bg-white'}`}>
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#caa161]' : 'text-gray-400'}`} />
                    </div>
                    <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="sidebar-pill" className="ml-auto">
                        <ChevronRight className="w-4 h-4 text-[#caa161]" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content Area - Premium Cards */}
          <main className="lg:col-span-9">
            <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-10 md:p-14 border border-white shadow-2xl shadow-[#caa161]/5 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-components

function PersonalInfo({ user }) {
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await refreshUser();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Identity</h2>
          <p className="text-gray-400 font-medium mt-1">Manage your account presence.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#caa161] hover:bg-gray-900 hover:text-white transition-all shadow-sm"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 absolute left-6 top-4 z-10">Legal Name</label>
              <input
                type="text"
                className="w-full pl-6 pr-6 pt-10 pb-4 bg-white border border-gray-100 rounded-3xl focus:ring-4 focus:ring-[#caa161]/10 focus:border-[#caa161] outline-none transition-all font-bold text-gray-900 shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 absolute left-6 top-4 z-10">Mobile Line</label>
              <input
                type="tel"
                className="w-full pl-6 pr-6 pt-10 pb-4 bg-white border border-gray-100 rounded-3xl focus:ring-4 focus:ring-[#caa161]/10 focus:border-[#caa161] outline-none transition-all font-bold text-gray-900 shadow-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Synchronize'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-10 py-5 bg-gray-100 text-gray-400 rounded-[2rem] font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard label="Account Owner" value={user.name} icon={UserIcon} />
          <InfoCard label="Communication Channel" value={user.email} icon={ShieldCheck} />
          <InfoCard label="Contact Line" value={user.phone || 'Not linked'} icon={Target} />
          <InfoCard label="Journey Since" value={new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} icon={Clock} />
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="p-8 bg-[#fafafa] border border-gray-50 rounded-[2.5rem] group hover:bg-white hover:shadow-xl hover:border-[#caa161]/20 transition-all duration-500">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#caa161] mb-6 shadow-sm border border-gray-50 group-hover:bg-[#caa161] group-hover:text-white transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Orders({ orders }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">History</h2>
          <p className="text-gray-400 font-medium mt-1">Timeline of your acquisitions.</p>
        </div>
        <div className="w-14 h-14 bg-[#fafafa] rounded-2xl flex items-center justify-center text-gray-400">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 bg-[#fafafa] rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Package className="w-8 h-8 text-gray-100" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">History is Empty</h3>
          <Link href="/" className="text-[#caa161] font-bold text-sm hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => (
            <div key={idx} className="group p-8 bg-[#fafafa] rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Identifier</p>
                    <p className="font-mono text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100 inline-block">#{order.orderId?.slice(-8) || 'AURA-'+idx}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="w-12 h-12 rounded-2xl border-2 border-white bg-white overflow-hidden shadow-md group-hover:rotate-6 transition-transform">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</p>
                    <p className="text-2xl font-black text-gray-900">₹{order.total?.toLocaleString()}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-300 ml-auto">{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#caa161] transition-all shadow-xl shadow-black/10">
                Details
              </button>
            </div>
          )).reverse()}
        </div>
      )}
    </div>
  );
}

function Wishlist({ wishlist }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Treasures</h2>
          <p className="text-gray-400 font-medium mt-1">Your curated selection.</p>
        </div>
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-400">
          <Heart className="w-6 h-6 fill-current" />
        </div>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="text-center py-20 bg-[#fafafa] rounded-[3rem] border-2 border-dashed border-gray-100">
          <Heart className="w-10 h-10 text-gray-100 mx-auto mb-4" />
          <p className="text-gray-400 font-bold">The vault is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {wishlist.map((item, idx) => (
            <div key={idx} className="group bg-[#fafafa] p-6 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative">
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <h4 className="font-black text-gray-900 mb-1">{item.name}</h4>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-black text-[#9a7638]">₹{item.price}</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Addresses({ addresses }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Locations</h2>
          <p className="text-gray-400 font-medium mt-1">Delivery endpoints.</p>
        </div>
        <button className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-black/20">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-20 bg-[#fafafa] rounded-[3rem] border-2 border-dashed border-gray-100">
          <MapPin className="w-10 h-10 text-gray-100 mx-auto mb-4" />
          <p className="text-gray-400 font-bold">No coordinates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((addr, i) => (
            <div key={i} className="p-10 bg-[#fafafa] rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 relative group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#caa161] mb-8 shadow-sm border border-gray-50">
                <MapPin className="w-5 h-5" />
              </div>
              {addr.isDefault && <span className="absolute top-10 right-10 text-[8px] font-black uppercase tracking-widest bg-[#caa161]/10 text-[#9a7638] px-3 py-1 rounded-full">Primary</span>}
              <h4 className="text-2xl font-black text-gray-900 mb-2">{addr.name}</h4>
              <p className="text-gray-500 font-medium leading-relaxed">{addr.street}, {addr.city}<br />{addr.state} - {addr.zipCode}</p>
              <div className="mt-8 flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-[10px] font-black uppercase tracking-widest text-[#caa161] hover:underline">Edit</button>
                <button className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Reminders({ reminders }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Celebrations</h2>
          <p className="text-gray-400 font-medium mt-1">Smart event tracking.</p>
        </div>
        <button className="px-8 py-3 bg-[#caa161]/10 text-[#9a7638] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#caa161]/20 transition-all flex items-center gap-2">
          <Bell className="w-4 h-4" /> Add Event
        </button>
      </div>
      
      <div className="p-12 bg-gray-900 rounded-[3rem] text-white relative overflow-hidden mb-12 shadow-2xl shadow-black/20">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
            <Sparkles className="w-8 h-8 text-[#caa161]" />
          </div>
          <h3 className="text-2xl font-black mb-4 tracking-tight">AI Smart Calendar</h3>
          <p className="text-white/60 font-medium max-w-sm leading-relaxed">Let AI track your most precious moments and suggest the perfect gift.</p>
        </div>
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#caa161] opacity-10 rounded-full blur-[100px] -mr-32 -mb-32" />
      </div>

      <div className="h-[200px] flex items-center justify-center bg-[#fafafa] rounded-[2.5rem] border border-gray-100">
        <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No Events Recorded</p>
      </div>
    </div>
  );
}

function SettingsSection({ logout }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Preferences</h2>
          <p className="text-gray-400 font-medium mt-1">Calibrate your account.</p>
        </div>
        <div className="w-14 h-14 bg-[#fafafa] rounded-2xl flex items-center justify-center text-gray-400">
          <Settings className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingCard title="Security" desc="Passwords and 2FA" icon={Lock} />
        <SettingCard title="Notifications" desc="Email and mobile alerts" icon={Bell} />
        <SettingCard title="Payment Suite" desc="Cards and billing" icon={CreditCard} />
        <div 
          onClick={logout}
          className="p-10 bg-red-50 border border-red-100 rounded-[2.5rem] group cursor-pointer hover:bg-red-500 transition-all duration-500 md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-sm">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-900 group-hover:text-white transition-colors">Terminate Session</h4>
                <p className="text-sm font-medium text-red-400 group-hover:text-red-100 transition-colors">Sign out securely</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-red-200 group-hover:text-white transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingCard({ title, desc, icon: Icon }) {
  return (
    <div className="p-10 bg-[#fafafa] border border-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:border-[#caa161]/20 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#caa161] group-hover:bg-[#caa161] group-hover:text-white transition-all shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
        <ChevronRight className="w-5 h-5 text-gray-100 group-hover:text-[#caa161] transition-all" />
      </div>
      <h4 className="text-xl font-black text-gray-900 mb-1">{title}</h4>
      <p className="text-sm font-medium text-gray-400">{desc}</p>
    </div>
  );
}
