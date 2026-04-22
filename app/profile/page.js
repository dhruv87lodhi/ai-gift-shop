import Link from "next/link";
import { User, Settings, Package, Heart, LogOut, Gift } from "lucide-react";
import Chatbot from "@/components/Chatbot";

export default function ProfilePage() {
  const mockOrders = [
    { id: "ORD-1092", date: "April 15, 2026", status: "Delivered", total: 145.00 },
    { id: "ORD-0844", date: "March 02, 2026", status: "Shipped", total: 89.99 },
    { id: "ORD-0711", date: "February 14, 2026", status: "Delivered", total: 299.99 },
  ];

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto flex flex-col">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#caa161] to-[#b08a50] flex items-center justify-center shadow-lg shadow-[#caa161]/20">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Hello, Alex
          </h1>
          <p className="text-gray-400">alex.shopper@example.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#111] border border-white/10 text-[#caa161] rounded-xl font-medium transition-colors">
            <User className="w-5 h-5" /> Account Details
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] hover:border hover:border-white/5 rounded-xl border border-transparent font-medium transition-colors">
            <Package className="w-5 h-5" /> Order History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] hover:border hover:border-white/5 rounded-xl border border-transparent font-medium transition-colors">
            <Heart className="w-5 h-5" /> Saved Items
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] hover:border hover:border-white/5 rounded-xl border border-transparent font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <div className="pt-8">
            <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl font-medium transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-[#caa161]/20 rounded-full flex items-center justify-center text-[#caa161] mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">12</h3>
              <p className="text-gray-400">Gifts Purchased</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-[#caa161]/20 rounded-full flex items-center justify-center text-[#caa161] mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">5</h3>
              <p className="text-gray-400">Saved Items</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-[#caa161]/20 rounded-full flex items-center justify-center text-[#caa161] mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">1</h3>
              <p className="text-gray-400">Active Order</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5 gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{order.id}</h4>
                    <p className="text-sm text-gray-400">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-white">${order.total.toFixed(2)}</span>
                    <button className="text-sm text-[#caa161] hover:text-white transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-white/10 hover:bg-white/5 text-white rounded-xl font-medium transition-colors">
              View All Orders
            </button>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
