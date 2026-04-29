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
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Target,
  Sparkles,
  Wallet,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <Gift className="absolute w-6 h-6 text-primary animate-pulse" />
      </div>
    </div>
  );
  
  if (!user) return null;

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, href: '/cart' },
    { id: 'addresses', label: 'Address', icon: MapPin },
    { id: 'personal', label: 'Account Details', icon: UserIcon },
    { id: 'reminders', label: 'Gift Reminders', icon: Bell },
    { id: 'logout', label: 'Log Out', icon: LogOut, action: logout },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo user={user} />;
      case 'orders':
        return <Orders orders={user.orders || []} />;
      case 'wishlist':
        return <Wishlist />;
      case 'addresses':
        return <Addresses addresses={user.addresses || []} />;
      case 'reminders':
        return <Reminders reminders={user.giftReminders || []} />;
      default:
        return <PersonalInfo user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-sm mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-charcoal">
            My <span className="text-primary">Profile</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Sidebar: Profile Card */}
          <aside className="w-full lg:w-[320px] glass rounded-[2.5rem] border border-white/60 overflow-hidden shrink-0 shadow-premium animate-fade-in-up">
            <div className="p-10 flex flex-col items-center text-center border-b border-gray-100 bg-white/40">
              <div className="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-white shadow-2xl relative group">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=caa161&color=fff&size=128&bold=true`} 
                  alt={user.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Edit2 className="text-white w-6 h-6" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-charcoal">{user.name}</h2>
              <p className="text-gray-400 text-sm mt-1 font-medium truncate w-full px-4">{user.email}</p>
            </div>

            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                if (tab.href) return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-500 hover:bg-white hover:text-primary hover:shadow-md transition-all font-bold text-sm group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {tab.label}
                  </Link>
                );

                return (
                  <button
                    key={tab.id}
                    onClick={() => tab.action ? tab.action() : setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm group ${
                      activeTab === tab.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                      : 'text-gray-500 hover:bg-white hover:text-primary hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${activeTab === tab.id ? 'text-white' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 space-y-10 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Top Shortcut Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-primary/20"
                onClick={() => setActiveTab('orders')}
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-charcoal leading-none mb-3">Order<br/><span className="text-primary">Tracking</span></h3>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">History & Status</p>
                </div>
                <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">
                   <Package className="w-full h-full text-primary/10 absolute -inset-2" />
                   <div className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center">
                     <ShoppingBag className="w-12 h-12 text-primary" />
                   </div>
                </div>
              </div>

              <div 
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-secondary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-secondary/20"
                onClick={() => setActiveTab('addresses')}
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-charcoal leading-none mb-3">Saved<br/><span className="text-secondary">Address</span></h3>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Manage locations</p>
                </div>
                <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                   <MapPin className="w-full h-full text-secondary/10 absolute -inset-2" />
                   <div className="w-full h-full bg-secondary/10 rounded-3xl flex items-center justify-center">
                     <MapPin className="w-12 h-12 text-secondary" />
                   </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="glass rounded-[3rem] p-8 md:p-14 border border-white/80 shadow-premium min-h-[600px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative z-10"
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
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
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
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone
        }),
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-charcoal">Account <span className="text-primary">Details</span></h2>
          <p className="text-gray-400 font-medium mt-1">Manage your personal information and security.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-4 bg-charcoal text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
          <div className="relative group">
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 outline-none transition-all font-bold ${
                isEditing 
                ? 'border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white text-charcoal' 
                : 'border-transparent bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              value={isEditing ? formData.firstName : user.name.split(' ')[0]}
              readOnly={!isEditing}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
          <div className="relative group">
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 outline-none transition-all font-bold ${
                isEditing 
                ? 'border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white text-charcoal' 
                : 'border-transparent bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              value={isEditing ? formData.lastName : user.name.split(' ').slice(1).join(' ')}
              readOnly={!isEditing}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200" />
            <input
              type="email"
              className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-transparent bg-gray-50 text-gray-400 cursor-not-allowed font-bold"
              value={user.email}
              readOnly
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
          <div className="relative group">
            <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input
              type="tel"
              className={`w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 outline-none transition-all font-bold ${
                isEditing 
                ? 'border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white text-charcoal' 
                : 'border-transparent bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              value={isEditing ? formData.phone : user.phone || ''}
              readOnly={!isEditing}
              placeholder="Not provided"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex items-center gap-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="font-black text-charcoal">Account Security</p>
          <p className="text-sm text-gray-500 font-medium">Your password and security settings are protected.</p>
        </div>
        <button className="ml-auto text-primary font-black text-sm hover:underline">Change Password</button>
      </div>
    </div>
  );
}

function Orders({ orders }) {
  return (
    <div className="space-y-10">
      <div className="border-b border-gray-100 pb-8">
        <h2 className="text-3xl font-black text-charcoal">Order <span className="text-primary">History</span></h2>
        <p className="text-gray-400 font-medium mt-1">Track and manage your previous gift orders.</p>
      </div>
      
      {!orders || orders.length === 0 ? (
        <div className="text-center py-24 bg-[#fff8f8] rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-500 font-black text-lg">No orders found</p>
          <Link href="/" className="text-primary font-black text-sm hover:underline mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => (
            <div key={idx} className="p-8 bg-[#fff8f8] rounded-[2.5rem] border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5 group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black text-primary text-sm">
                    G
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="font-black text-charcoal">{order.orderId || 'GFT-'+idx}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Placed On</p>
                    <p className="font-bold text-charcoal">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <div className="flex items-center gap-2 text-green-500 font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      {order.status}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex -space-x-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="w-16 h-16 rounded-[1.25rem] border-4 border-white bg-white overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300" style={{ transitionDelay: `${i * 100}ms` }}>
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                   <p className="text-2xl font-black text-charcoal">₹{order.total?.toLocaleString()}</p>
                </div>
                <button className="px-8 py-4 border-2 border-primary/20 text-primary rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all">
                  Order Details
                </button>
              </div>
            </div>
          )).reverse()}
        </div>
      )}
    </div>
  );
}

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  
  return (
    <div className="space-y-10">
      <div className="border-b border-gray-100 pb-8">
        <h2 className="text-3xl font-black text-charcoal">My <span className="text-secondary">Wishlist</span></h2>
        <p className="text-gray-400 font-medium mt-1">Your curated collection of favorite gifts.</p>
      </div>
      
      {!wishlist || wishlist.length === 0 ? (
        <div className="text-center py-24 bg-[#fff8f8] rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-500 font-black text-lg">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-1 font-medium">Save gifts you love to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {wishlist.map((item, idx) => (
            <div key={idx} className="bg-[#fff8f8] p-6 rounded-[2.5rem] border border-gray-100 flex gap-6 items-center group transition-all hover:bg-white hover:shadow-xl hover:shadow-secondary/5">
              <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-md">
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-charcoal group-hover:text-secondary transition-colors line-clamp-1">{item.name}</h4>
                <p className="text-secondary font-black text-xl">₹{item.price}</p>
              </div>
              <button 
                onClick={() => toggleWishlist(item)}
                className="bg-white text-secondary p-4 rounded-2xl shadow-sm hover:bg-secondary hover:text-white transition-all group-hover:scale-110"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Addresses({ addresses: initialAddresses }) {
  const { refreshUser } = useAuth();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
        await refreshUser();
        setShowForm(false);
        setFormData({ name: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (id) => {
    if (!confirm('Remove this address?')) return;
    try {
      const res = await fetch(`/api/user/address?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-3xl font-black text-charcoal">Saved <span className="text-secondary">Addresses</span></h2>
          <p className="text-gray-400 font-medium mt-1">Manage your delivery locations for faster checkout.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-charcoal text-white rounded-2xl font-black text-sm hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd} 
          className="bg-[#fff8f8] border-2 border-secondary/10 rounded-[3rem] p-10 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Label (e.g. Home, Office)</label>
              <input required className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
              <input required className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none font-bold" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
              <input required className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none font-bold" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
              <input required className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none font-bold" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
              <input required className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none font-bold" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="isDefault" className="sr-only peer" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
                <label htmlFor="isDefault" className="ml-4 text-sm font-black text-gray-600">Set as default address</label>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="px-10 py-5 bg-secondary text-white rounded-2xl font-black text-sm shadow-xl shadow-secondary/20">
              {loading ? 'Adding...' : 'Save Address'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-10 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-24 bg-[#fff8f8] rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MapPin className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-500 font-black text-lg">No addresses saved yet</p>
          <p className="text-gray-400 text-sm mt-1 font-medium">Add an address to speed up your checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((addr, i) => (
            <motion.div 
              key={addr._id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 bg-[#fff8f8] rounded-[3rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-2xl hover:shadow-secondary/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                {addr.isDefault && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-secondary text-white px-4 py-2 rounded-full shadow-lg shadow-secondary/20">Default</span>
                )}
              </div>
              
              <h4 className="font-black text-charcoal text-xl mb-3 tracking-tight">{addr.name}</h4>
              <p className="text-base text-gray-500 font-bold leading-relaxed mb-10">{addr.street}<br/>{addr.city}, {addr.state} - {addr.zipCode}</p>
              
              <div className="flex gap-10 border-t border-gray-100 pt-8">
                <button className="text-xs font-black text-secondary hover:underline uppercase tracking-widest">Edit</button>
                <button onClick={() => removeAddress(addr._id)} className="text-xs font-black text-red-400 hover:underline uppercase tracking-widest">Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Reminders({ reminders }) {
  return (
    <div className="space-y-10">
      <div className="border-b border-gray-100 pb-8">
        <h2 className="text-3xl font-black text-charcoal">Gift <span className="text-primary">Reminders</span></h2>
        <p className="text-gray-400 font-medium mt-1">Our AI helps you never miss a celebration.</p>
      </div>
      
      <div className="relative p-10 rounded-[3rem] overflow-hidden bg-charcoal text-white mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md">
            <Calendar className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-3">Giftora Smart Calendar</h3>
            <p className="text-gray-300 font-medium leading-relaxed max-w-lg">
              Add your special dates and let our AI suggest the most thoughtful presents <span className="text-primary font-black">7 days in advance</span>.
            </p>
          </div>
          <button className="md:ml-auto px-10 py-5 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-primary/20">
            Add Celebration
          </button>
        </div>
      </div>
      
      <div className="text-center py-24 bg-[#fff8f8] rounded-[3rem] border-2 border-dashed border-gray-100">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Sparkles className="w-8 h-8 text-primary/30" />
        </div>
        <p className="text-gray-400 font-black text-lg">No upcoming celebrations recorded.</p>
        <p className="text-gray-400/60 text-sm mt-1 font-medium italic">Start adding reminders to see them here.</p>
      </div>
    </div>
  );
}
