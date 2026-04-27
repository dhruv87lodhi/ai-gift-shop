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
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
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
      case 'settings':
        return <SettingsSection logout={logout} />;
      default:
        return <PersonalInfo user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar: Profile Card */}
          <aside className="w-full lg:w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
            <div className="p-10 flex flex-col items-center text-center border-b border-gray-50">
              <div className="w-32 h-32 rounded-full bg-[#fcfcfc] mb-6 overflow-hidden border-4 border-white shadow-lg relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=caa161&color=fff&size=128&bold=true`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-400 text-sm mt-1 truncate w-full px-4">{user.email}</p>
            </div>

            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                if (tab.href) return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-gray-500 hover:bg-gray-50 transition-all font-semibold text-sm"
                  >
                    <tab.icon className="w-5 h-5 opacity-70" />
                    {tab.label}
                  </Link>
                );

                return (
                  <button
                    key={tab.id}
                    onClick={() => tab.action ? tab.action() : setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-semibold text-sm ${
                      activeTab === tab.id 
                      ? 'bg-red-50/50 text-[#caa161]' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#caa161]' : 'opacity-70'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 space-y-8">
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#fcfcfc] rounded-3xl p-10 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer overflow-hidden relative" onClick={() => setActiveTab('orders')}>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-2">Order <br/>Tracking</h3>
                  <p className="text-gray-400 text-sm font-medium">See your order history.</p>
                </div>
                <div className="w-32 h-32 relative z-10 translate-x-4">
                   <Package className="w-full h-full text-gray-100 group-hover:text-[#caa161]/10 transition-colors" />
                   <img src="https://cdn-icons-png.flaticon.com/512/2038/2038767.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="bg-[#fcfcfc] rounded-3xl p-10 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer overflow-hidden relative" onClick={() => setActiveTab('addresses')}>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-gray-900 mb-2">Saved <br/>Address</h3>
                  <p className="text-gray-400 text-sm font-medium">Manage your delivery locations.</p>
                </div>
                <div className="w-32 h-32 relative z-10 translate-x-4">
                   <MapPin className="w-full h-full text-gray-100 group-hover:text-[#caa161]/10 transition-colors" />
                   <img src="https://cdn-icons-png.flaticon.com/512/1239/1239525.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Dynamic Content Card */}
            <div className="bg-white rounded-3xl p-10 md:p-14 border border-gray-100 shadow-sm min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Details</h2>
        <div className="h-1 w-12 bg-[#caa161] rounded-full" />
      </div>

      {!isEditing ? (
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFormData({
                firstName: user.name.split(' ')[0] || '',
                lastName: user.name.split(' ').slice(1).join(' ') || '',
                phone: user.phone || '',
              });
              setIsEditing(true);
            }}
            className="px-8 py-3 bg-[#caa161] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#b08a50] transition-all shadow-lg shadow-[#caa161]/20 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      ) : (
        <div className="flex justify-end mb-6 gap-4">
           <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-8 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">First Name</label>
            <input
              type="text"
              className={`w-full px-6 py-4 bg-white border border-gray-200 rounded-xl outline-none transition-all font-medium text-gray-600 ${isEditing ? 'focus:ring-2 focus:ring-[#caa161]/20 focus:border-[#caa161] border-[#caa161]/50 bg-white' : 'bg-gray-50/50 cursor-not-allowed'}`}
              value={isEditing ? formData.firstName : user.name.split(' ')[0]}
              readOnly={!isEditing}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Last Name</label>
            <input
              type="text"
              className={`w-full px-6 py-4 bg-white border border-gray-200 rounded-xl outline-none transition-all font-medium text-gray-600 ${isEditing ? 'focus:ring-2 focus:ring-[#caa161]/20 focus:border-[#caa161] border-[#caa161]/50 bg-white' : 'bg-gray-50/50 cursor-not-allowed'}`}
              value={isEditing ? formData.lastName : user.name.split(' ').slice(1).join(' ')}
              readOnly={!isEditing}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Email Address</label>
            <input
              type="email"
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-xl font-medium text-gray-400 cursor-not-allowed"
              value={user.email}
              readOnly
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Phone Number</label>
            <input
              type="tel"
              className={`w-full px-6 py-4 bg-white border border-gray-200 rounded-xl outline-none transition-all font-medium text-gray-600 ${isEditing ? 'focus:ring-2 focus:ring-[#caa161]/20 focus:border-[#caa161] border-[#caa161]/50 bg-white' : 'bg-gray-50/50 cursor-not-allowed'}`}
              value={isEditing ? formData.phone : user.phone || ''}
              readOnly={!isEditing}
              placeholder={isEditing ? "Enter phone number" : "Not provided"}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-xl font-medium text-gray-400 cursor-not-allowed"
                value="********"
                readOnly
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Orders({ orders }) {
  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
        <div className="h-1 w-12 bg-[#caa161] rounded-full" />
      </div>
      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">No orders found</p>
          <Link href="/" className="text-[#caa161] font-bold text-sm hover:underline mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={idx} className="p-6 bg-[#fafafa] rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full text-left">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="font-bold text-gray-900">{order.orderId || 'AURA-'+idx}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <p className="text-green-500 font-bold text-sm">{order.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-900 ml-2">₹{order.total?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 ml-auto">{new Date(order.date).toLocaleDateString()}</p>
                </div>
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
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist</h2>
        <div className="h-1 w-12 bg-[#caa161] rounded-full" />
      </div>
      {!wishlist || wishlist.length === 0 ? (
        <div className="text-center py-20 bg-[#fafafa] rounded-2xl border border-dashed border-gray-200">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {wishlist.map((item, idx) => (
            <div key={idx} className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 flex gap-4 items-center">
              <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                <p className="text-[#caa161] font-black text-sm">₹{item.price}</p>
              </div>
              <button 
                onClick={() => toggleWishlist(item)}
                className="text-red-400 p-2 hover:bg-white rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4 fill-current" />
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
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Addresses</h2>
          <div className="h-1 w-12 bg-[#caa161] rounded-full" />
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-[#caa161] transition-all shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd} 
          className="bg-white border-2 border-[#caa161]/20 rounded-3xl p-8 mb-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Address Name (e.g. Home, Office)</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#caa161] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Street Address</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#caa161] outline-none" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">City</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#caa161] outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">State</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#caa161] outline-none" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Zip Code</label>
              <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#caa161] outline-none" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
            <label htmlFor="isDefault" className="text-sm font-bold text-gray-600">Set as default address</label>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-[#caa161] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#caa161]/20">
              {loading ? 'Adding...' : 'Save Address'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-24 bg-[#fafafa] rounded-[2rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MapPin className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-500 font-bold">No addresses saved yet</p>
          <p className="text-gray-400 text-xs mt-1">Add an address to speed up your checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr, i) => (
            <motion.div 
              key={addr._id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-[#fafafa] rounded-[2rem] border border-gray-100 relative group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              {addr.isDefault && <span className="absolute top-6 right-8 text-[8px] font-black uppercase tracking-widest bg-green-100 text-green-600 px-3 py-1 rounded-full">Default</span>}
              <h4 className="font-black text-gray-900 mb-2 text-lg uppercase tracking-tight">{addr.name}</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{addr.street}<br/>{addr.city}, {addr.state} - {addr.zipCode}</p>
              <div className="flex gap-6 border-t border-gray-100 pt-6">
                <button className="text-xs font-bold text-[#caa161] hover:underline uppercase tracking-wider">Edit</button>
                <button onClick={() => removeAddress(addr._id)} className="text-xs font-bold text-red-400 hover:underline uppercase tracking-wider">Remove</button>
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
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gift Reminders</h2>
        <div className="h-1 w-12 bg-[#caa161] rounded-full" />
      </div>
      <div className="p-8 bg-gray-900 rounded-[2rem] text-white mb-8">
        <h3 className="text-lg font-bold mb-2">The Aura Smart Calendar</h3>
        <p className="text-white/60 text-sm">Add your special dates and let our AI suggest the perfect gift 7 days in advance.</p>
      </div>
      <div className="text-center py-12 bg-[#fafafa] rounded-3xl border border-gray-100">
        <p className="text-gray-400 text-sm font-medium italic">No upcoming celebrations recorded.</p>
      </div>
    </div>
  );
}

function SettingsSection({ logout }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-10">Settings</h2>
      <div className="space-y-4">
        <SettingItem label="Security" desc="Password and 2-step verification" icon={Lock} />
        <SettingItem label="Notifications" desc="Email and SMS preferences" icon={Bell} />
      </div>
    </div>
  );
}

function SettingItem({ label, desc, icon: Icon }) {
  return (
    <div className="p-6 bg-[#fafafa] border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md hover:border-[#caa161]/20 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[#caa161] group-hover:bg-[#caa161] group-hover:text-white transition-all">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{label}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#caa161] transition-all" />
    </div>
  );
}
