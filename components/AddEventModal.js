"use client";

import { useState } from "react";
import { X, Calendar, User, Heart, Sparkles } from "lucide-react";

export default function AddEventModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    occasion: "Birthday",
    date: "",
    relationship: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/reminders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        onAdd();
        onClose();
        setFormData({ name: "", occasion: "Birthday", date: "", relationship: "" });
      } else {
        alert(data.error || "Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#c49b63]/10 p-2 rounded-xl text-[#c49b63]">
                <PlusIcon />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Add New Event</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Loved One's Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Sarah"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#c49b63]/20 focus:bg-white transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Occasion</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c49b63]/20 focus:bg-white transition"
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                >
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Wedding</option>
                  <option>Graduation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Relation</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sister"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#c49b63]/20 focus:bg-white transition"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="date"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#c49b63]/20 focus:bg-white transition"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#c49b63] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#c49b63]/20 hover:scale-[1.02] transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Save Reminder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
