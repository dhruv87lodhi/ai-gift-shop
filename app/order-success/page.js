"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight, Gift, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const paymentId = searchParams.get("payment_id") || "";
  const orderId = searchParams.get("order_id") || "";
  const customerName = searchParams.get("name") || "Customer";
  const address = searchParams.get("address") || "";
  const delivery = searchParams.get("delivery") || "5-7 business days";
  const total = searchParams.get("total") || "0";

  // Clear cart on successful payment
  useEffect(() => {
    if (paymentId) {
      clearCart();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6"
          >
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
          >
            Order Confirmed! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-500 max-w-md mx-auto"
          >
            Thank you, <span className="font-semibold text-gray-900">{customerName}</span>! Your gift is on its way.
          </motion.p>
        </div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-3xl border border-gray-200 overflow-hidden mb-8"
        >
          {/* Header bar */}
          <div className="bg-gradient-to-r from-[#caa161] to-[#b08a50] px-8 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6" />
                <span className="font-bold text-lg">Giftora Order</span>
              </div>
              <span className="text-2xl font-extrabold">₹{Number(total).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">
            {/* Payment Info */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-green-100 rounded-xl text-green-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Payment Successful</h3>
                <p className="text-sm text-gray-500">Payment ID: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{paymentId}</span></p>
                {orderId && <p className="text-sm text-gray-500 mt-1">Order ID: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{orderId}</span></p>}
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Delivery Address */}
            {address && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shipping Address</h3>
                  <p className="text-sm text-gray-500">{address}</p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200"></div>

            {/* Estimated Delivery */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#caa161]/15 rounded-xl text-[#caa161] shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h3>
                <p className="text-sm text-gray-500">{delivery}</p>
                <p className="text-xs text-gray-400 mt-1">You'll receive tracking updates via SMS</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/"
            className="flex-1 py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] text-white rounded-xl font-bold text-center hover:from-[#b08a50] hover:to-[#9a7638] transition-all shadow-lg shadow-[#caa161]/20 flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/profile"
            className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors border border-gray-200 flex items-center justify-center gap-2"
          >
            View Orders
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#caa161]" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
