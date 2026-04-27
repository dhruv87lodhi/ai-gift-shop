import Link from "next/link";
import { User, Settings, Package, Heart, LogOut, Gift } from "lucide-react";
import Chatbot from "@/components/Chatbot";

export default function ProfilePage() {
  const mockOrders = [
    { id: "ORD-1092", date: "April 15, 2026", status: "Delivered", total: 12499 },
    { id: "ORD-0844", date: "March 02, 2026", status: "Shipped", total: 6999 },
    { id: "ORD-0711", date: "February 14, 2026", status: "Delivered", total: 24999 },
  ];

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto flex flex-col">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#caa161] to-[#b08a50] flex items-center justify-center shadow-lg shadow-[#caa161]/20">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Hello, Alex
          </h1>
          <p className="text-gray-500">alex.shopper@example.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#caa161]/10 border border-[#caa161]/30 text-[#9a7638] rounded-xl font-medium transition-colors">
            <User className="w-5 h-5" /> Account Details
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-transparent font-medium transition-colors">
            <Package className="w-5 h-5" /> Order History
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-transparent font-medium transition-colors">
            <Heart className="w-5 h-5" /> Saved Items
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-transparent font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <div className="pt-8">
            <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border border-gray-200">
              <div className="w-12 h-12 bg-[#caa161]/15 rounded-full flex items-center justify-center text-[#caa161] mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">12</h3>
              <p className="text-gray-500">Gifts Purchased</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-gray-200">
              <div className="w-12 h-12 bg-[#caa161]/15 rounded-full flex items-center justify-center text-[#caa161] mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">5</h3>
              <p className="text-gray-500">Saved Items</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-gray-200">
              <div className="w-12 h-12 bg-[#caa161]/15 rounded-full flex items-center justify-center text-[#caa161] mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">1</h3>
              <p className="text-gray-500">Active Order</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass p-8 rounded-3xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                    <button className="text-sm text-[#caa161] hover:text-[#9a7638] transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">
              View All Orders
            </button>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
