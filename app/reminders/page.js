"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import globalEvents from "@/data/globalEvents.json";
import { products } from "@/data/mockData";
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Gift, 
  Clock, 
  Sparkles,
  AlertCircle,
  TrendingUp,
  Heart,
  Trash2,
  Globe,
  Cake,
  Users
} from "lucide-react";
import Link from "next/link";
import AddEventModal from "@/components/AddEventModal";
import GiftSuggestionsModal from "@/components/GiftSuggestionsModal";

export default function RemindersPage() {
  const { user } = useAuth();
  const [personalReminders, setPersonalReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventForGifts, setSelectedEventForGifts] = useState(null);
  const { refreshUser } = useAuth();
  
  // New Isolated States for Global Occasions
  const [globalOccasions, setGlobalOccasions] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState(null);
  
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
        personal = [
          { name: "mom", occasion: "Birthday", relation: "Friend", date: "2026-05-01", type: "Birthday" },
          { name: "shyam", occasion: "Birthday", relation: "Colleague", date: "2026-05-01", type: "Birthday" },
          { name: "father", occasion: "Anniversary", relation: "Partner", date: "2026-05-09", type: "Anniversary" }
        ];
      }

      const processed = personal.map(event => {
        const eventDate = new Date(event.date);
        const diffTime = eventDate - CURRENT_DATE;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...event, daysLeft };
      }).sort((a, b) => a.daysLeft - b.daysLeft);

      setPersonalReminders(processed);
      setLoading(false);
    };

    fetchOccasions();
  }, [user]);

  useEffect(() => {
    const loadGlobalOccasions = () => {
      try {
        setLoadingGlobal(true);
        const filtered = globalEvents
          .map(event => {
            const eventDate = new Date(event.date);
            const diffTime = eventDate - CURRENT_DATE;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (daysLeft >= 0 && daysLeft <= 30) {
              return { ...event, daysLeft };
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => a.daysLeft - b.daysLeft);

        setGlobalOccasions(filtered);
        setErrorGlobal(filtered.length === 0 ? "No upcoming occasions" : null);
      } catch (err) {
        setErrorGlobal("Unable to load occasions");
      } finally {
        setLoadingGlobal(false);
      }
    };
    loadGlobalOccasions();
  }, []);

  const handleDelete = async (reminderId) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    
    try {
      const res = await fetch(`/api/user/reminders/delete?id=${reminderId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        refreshUser();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    }
  };

  const filteredAllEvents = personalReminders.filter(event => {
    if (activeTab === "All") return true;
    if (activeTab === "Birthdays") return event.type === "Birthday" || event.occasion.toLowerCase() === "birthday";
    if (activeTab === "Anniversaries") return event.type === "Anniversary" || event.occasion.toLowerCase().includes("anniversary");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-gray-900" />
              <h1 className="text-4xl font-black tracking-tight text-gray-900">Reminders</h1>
            </div>
            <p className="text-gray-500 text-lg">Never miss a special day for your loved ones.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#c49b63] text-white px-6 py-2.5 rounded-full font-bold shadow-xl shadow-[#c49b63]/20 hover:scale-105 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Event
          </button>
        </div>

        {/* Section 1: Upcoming Events */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">Next 15 Days</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100" />)
            ) : (
              personalReminders.filter(e => e.daysLeft <= 15).map((event, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
                        {event.occasion.toLowerCase().includes("birthday") ? "🎂" : "❤️"}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold capitalize text-gray-900">
                          {["mom", "father", "mother", "brother", "sister", "son", "daughter", "wife", "husband", "parent", "grandma", "grandpa", "uncle", "aunt"].includes(event.relationship?.toLowerCase() || event.relation?.toLowerCase()) 
                            ? event.relationship || event.relation
                            : event.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {["mom", "father", "mother", "brother", "sister", "son", "daughter", "wife", "husband", "parent", "grandma", "grandpa", "uncle", "aunt"].includes(event.relationship?.toLowerCase() || event.relation?.toLowerCase()) 
                            ? event.occasion 
                            : `${event.relation} • ${event.occasion}`}
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#c49b63]/10 text-[#c49b63] px-3 py-1.5 rounded-full text-[10px] font-bold">
                      Upcoming (in {event.daysLeft} days)
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedEventForGifts(event)}
                      className="flex-1 bg-[#c49b63] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#b08a50] transition"
                    >
                      <Gift className="w-5 h-5" />
                      View Gifts
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id || event.id)}
                      className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-400 hover:bg-red-50 transition border border-gray-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Upcoming Occasions */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Occasions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingGlobal ? (
              <div className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ) : (
              globalOccasions.map((occasion, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c49b63]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{occasion.name}</h3>
                        <p className="text-gray-500 font-medium mt-1">{occasion.date}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-[10px] font-bold">
                        in {occasion.daysLeft} days
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedEventForGifts({ ...occasion, name: occasion.name, relation: occasion.type || "Everyone" })}
                      className="w-full bg-[#c49b63] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#b08a50] transition shadow-lg shadow-[#c49b63]/20"
                    >
                      <Gift className="w-6 h-6" />
                      View Gifts
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 3: All Events */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
            </div>
            <div className="bg-gray-100 p-1 rounded-2xl flex gap-1">
              {["All", "Birthdays", "Anniversaries"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
            {filteredAllEvents.length > 0 ? (
              filteredAllEvents.map((event, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 transition group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">
                      {event.occasion.toLowerCase().includes("birthday") ? "🎂" : "❤️"}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold capitalize text-gray-900">
                        {["mom", "father", "mother", "brother", "sister", "son", "daughter", "wife", "husband", "parent", "grandma", "grandpa", "uncle", "aunt"].includes(event.relationship?.toLowerCase() || event.relation?.toLowerCase()) 
                          ? event.relationship || event.relation
                          : event.name}
                      </h4>
                      <p className="text-gray-500 text-sm">{event.date} • {event.occasion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setSelectedEventForGifts(event)}
                      className="text-[#c49b63] text-sm font-bold hover:underline"
                    >
                      View Gifts
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id || event.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No events found in this category.</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Add Event Modal */}
      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={() => {
          refreshUser(); // Refresh auth context to get new reminders
        }}
      />

      {/* Gift Suggestions Modal */}
      <GiftSuggestionsModal 
        isOpen={!!selectedEventForGifts}
        onClose={() => setSelectedEventForGifts(null)}
        event={selectedEventForGifts}
      />
    </div>
  );
}
