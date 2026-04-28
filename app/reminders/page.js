"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import globalEvents from "@/data/globalEvents.json";
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Gift, 
  Clock, 
  Sparkles,
  Heart,
  Trash2,
  Globe,
  Cake,
  Users,
  ChevronLeft,
  CalendarDays,
  Target,
  Search,
  Star,
  Info
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AddEventModal from "@/components/AddEventModal";
import GiftSuggestionsModal from "@/components/GiftSuggestionsModal";
import Chatbot from "@/components/Chatbot";

export default function RemindersPage() {
  const { user, refreshUser } = useAuth();
  const [personalReminders, setPersonalReminders] = useState([]);
  const [globalOccasions, setGlobalOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventForGifts, setSelectedEventForGifts] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const CURRENT_DATE = new Date("2026-04-28"); // Mock current date

  useEffect(() => {
    const fetchOccasions = async () => {
      setLoading(true);
      let personal = [];
      if (user?.giftReminders) {
        personal = user.giftReminders.map(r => ({
          ...r,
          id: r._id || `p-${Math.random()}`,
          dateObj: new Date(r.date)
        }));
      } else {
        // Mock fallback if no user or no reminders
        personal = [
          { name: "Mom", occasion: "Birthday", relation: "Family", date: "2026-05-01", type: "Birthday" },
          { name: "Sarah", occasion: "Wedding", relation: "Friend", date: "2026-05-15", type: "Wedding" },
        ];
      }

      const processed = personal.map(event => {
        const eventDate = new Date(event.date);
        const diffTime = eventDate - CURRENT_DATE;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...event, daysLeft };
      }).sort((a, b) => a.daysLeft - b.daysLeft);

      setPersonalReminders(processed);

      // Load Global Occasions
      const filteredGlobal = globalEvents
        .map(event => {
          const eventDate = new Date(event.date);
          const diffTime = eventDate - CURRENT_DATE;
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (daysLeft >= 0 && daysLeft <= 60) {
            return { ...event, daysLeft };
          }
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => a.daysLeft - b.daysLeft);

      setGlobalOccasions(filteredGlobal);
      setLoading(false);
    };

    fetchOccasions();
  }, [user]);

  const handleDelete = async (reminderId) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    try {
      const res = await fetch(`/api/user/reminders/delete?id=${reminderId}`, { method: "DELETE" });
      if (res.ok) refreshUser();
    } catch (err) { console.error(err); }
  };

  const filteredEvents = personalReminders.filter(event => {
    if (activeTab === "All") return true;
    if (activeTab === "Birthdays") return event.type === "Birthday" || event.occasion.toLowerCase().includes("birthday");
    if (activeTab === "Anniversaries") return event.type === "Anniversary" || event.occasion.toLowerCase().includes("anniversary");
    return true;
  });

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section (Matching Profile/Cart) */}
        <div className="mb-12 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-bold text-sm mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h1 className="text-4xl md:text-5xl font-black text-charcoal">
                Gift <span className="text-primary">Reminders</span>
              </h1>
              <p className="text-gray-400 font-medium mt-1">Our AI helps you never miss a celebration.</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-10 py-5 bg-charcoal text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> Add New Event
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Sidebar: Smart Calendar Info (Matching Profile Sidebar) */}
          <aside className="w-full lg:w-[320px] glass rounded-[2.5rem] border border-white/60 overflow-hidden shrink-0 shadow-premium animate-fade-in-up">
            <div className="p-10 border-b border-gray-100 bg-white/40">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative group">
                <Bell className="w-10 h-10 text-primary" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {personalReminders.length}
                </div>
              </div>
              <h2 className="text-2xl font-black text-charcoal mb-1 tracking-tight">Smart Calendar</h2>
              <p className="text-gray-400 text-sm font-medium">Powered by Giftora AI</p>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="bg-gray-50 p-2 rounded-lg"><Sparkles className="w-4 h-4 text-primary" /></div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      AI scans for upcoming birthdays & anniversaries.
                    </p>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-gray-50 p-2 rounded-lg"><Clock className="w-4 h-4 text-primary" /></div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Get recommendations <span className="font-black text-charcoal">7 days</span> in advance.
                    </p>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-gray-50 p-2 rounded-lg"><Globe className="w-4 h-4 text-primary" /></div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Stay updated on global festivities.
                    </p>
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="bg-charcoal p-6 rounded-3xl text-white text-center shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000" />
                  <Info className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Coming Soon</p>
                  <p className="text-xs font-medium text-gray-400">Sync with Google Calendar</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area (Matching Profile Main Content) */}
          <main className="flex-1 space-y-10 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Top Shortcut Cards: Global Events Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => document.getElementById('upcoming-occasions')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-primary/20"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-charcoal leading-none mb-3">Upcoming<br/><span className="text-primary">Occasions</span></h3>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Festivals & Global Events</p>
                </div>
                <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">
                   <Globe className="w-full h-full text-primary/10 absolute -inset-2" />
                   <div className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center">
                     <CalendarDays className="w-12 h-12 text-primary" />
                   </div>
                </div>
              </div>
 
              <div 
                onClick={() => document.getElementById('personal-reminders')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/80 flex items-center justify-between group hover:shadow-2xl hover:shadow-secondary/10 transition-all cursor-pointer overflow-hidden relative border-b-4 border-b-secondary/20"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-charcoal leading-none mb-3">My<br/><span className="text-secondary">Reminders</span></h3>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Personal Celebrations</p>
                </div>
                <div className="w-24 h-24 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                   <Star className="w-full h-full text-secondary/10 absolute -inset-2" />
                   <div className="w-full h-full bg-secondary/10 rounded-3xl flex items-center justify-center">
                     <Target className="w-12 h-12 text-secondary" />
                   </div>
                </div>
              </div>
            </div>

            {/* Main Content Box (Matching Profile) */}
            <div className="glass rounded-[3rem] p-8 md:p-14 border border-white/80 shadow-premium min-h-[600px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="relative z-10 space-y-12">
                
                {/* Tabs & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    {["All", "Birthdays", "Anniversaries"].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          activeTab === tab 
                          ? 'bg-white text-charcoal shadow-lg' 
                          : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="relative group max-w-xs w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search events..." 
                      className="w-full pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                 {/* Upcoming Occasions (Global) */}
                {activeTab === "All" && globalOccasions.length > 0 && (
                   <section id="upcoming-occasions" className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-8">
                      <Globe className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-black text-charcoal uppercase tracking-tight">Upcoming Occasions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {globalOccasions.map((occasion, idx) => (
                        <div key={idx} className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white items-center flex justify-between group hover:shadow-xl transition-all">
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{occasion.type || 'Festive'}</p>
                            <h4 className="text-xl font-black text-charcoal leading-tight">{occasion.name}</h4>
                            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">{occasion.date}</p>
                          </div>
                          <div className="text-center">
                            <span className="block text-2xl font-black text-primary leading-none">{occasion.daysLeft}</span>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Days Left</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                 {/* Personal Reminders */}
                <section id="personal-reminders" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-5 h-5 text-secondary" />
                    <h3 className="text-xl font-black text-charcoal uppercase tracking-tight">My Reminders</h3>
                  </div>
                  
                  {filteredEvents.length === 0 ? (
                    <div className="py-24 text-center bg-[#fff8f8] rounded-[3rem] border-2 border-dashed border-gray-100">
                      <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-black text-lg">No reminders found.</p>
                      <button onClick={() => setIsAddModalOpen(true)} className="text-primary font-black text-sm hover:underline mt-2">Add your first event</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredEvents.map((event, idx) => (
                        <motion.div 
                          layout
                          key={event.id || idx}
                          className="p-6 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                              {event.type?.toLowerCase().includes("birthday") || event.occasion?.toLowerCase().includes("birthday") ? "🎂" : "❤️"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xl font-black text-charcoal leading-none capitalize">
                                  {event.name || event.relationship || event.relation}
                                </h4>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">({event.relation || 'Friend'})</span>
                              </div>
                              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                {event.occasion} • {event.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">In {event.daysLeft} Days</p>
                              <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max(10, 100 - (event.daysLeft * 5))}%` }}
                                  className="h-full bg-primary"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3">
                               <button 
                                onClick={() => setSelectedEventForGifts(event)}
                                className="px-6 py-3 bg-charcoal text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 shadow-lg"
                              >
                                <Gift className="w-4 h-4" /> Suggestions
                              </button>
                              <button 
                                onClick={() => handleDelete(event._id || event.id)}
                                className="p-3 text-gray-200 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </main>
        </div>
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={() => refreshUser()}
      />

      <GiftSuggestionsModal 
        isOpen={!!selectedEventForGifts}
        onClose={() => setSelectedEventForGifts(null)}
        event={selectedEventForGifts}
      />

      <Chatbot />
    </div>
  );
}
