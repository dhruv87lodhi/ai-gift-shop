"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Truck, Shield, CreditCard, Loader2, CheckCircle2, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Metro pincode prefixes for faster delivery
const METRO_PREFIXES = ["11", "40", "50", "60", "56", "70", "38", "30", "22", "41"];

function getDeliveryEstimate(pincode) {
  if (!pincode || pincode.length !== 6) return null;
  const prefix = pincode.substring(0, 2);
  const isMetro = METRO_PREFIXES.includes(prefix);
  
  const today = new Date();
  const minDays = isMetro ? 3 : 5;
  const maxDays = isMetro ? 5 : 7;
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  
  const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  
  return {
    isMetro,
    minDays,
    maxDays,
    label: `${formatDate(minDate)} – ${formatDate(maxDate)}`,
    speed: isMetro ? "Express Delivery" : "Standard Delivery",
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal } = useCart();
  const { user, loading } = useAuth();
  
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Handle Auth Redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, loading, router]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
      
      setForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
        address1: prev.address1 || defaultAddr?.street || "",
        city: prev.city || defaultAddr?.city || "",
        state: prev.state || defaultAddr?.state || "",
        pincode: prev.pincode || defaultAddr?.zipCode || "",
      }));
    }
  }, [user]);
  
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const shipping = cartTotal > 499 ? 0 : 49;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + tax + shipping;

  // Update delivery estimate when pincode changes
  useEffect(() => {
    if (form.pincode.length === 6 && /^\d{6}$/.test(form.pincode)) {
      setDeliveryEstimate(getDeliveryEstimate(form.pincode));
    } else {
      setDeliveryEstimate(null);
    }
  }, [form.pincode]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits for phone and pincode
    if (name === "phone" && value && !/^\d*$/.test(value)) return;
    if (name === "pincode" && value && !/^\d*$/.test(value)) return;
    if (name === "pincode" && value.length > 6) return;
    if (name === "phone" && value.length > 10) return;
    
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone || form.phone.length !== 10) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address1.trim()) newErrors.address1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode || form.pincode.length !== 6) newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validate()) return;
    
    setIsProcessing(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 2. Create order on server
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(finalTotal),
          currency: "INR",
          receipt: `giftora_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        console.error("Order creation failed:", errorData);
        alert("Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const order = await orderRes.json();

      // 3. Open Razorpay checkout
      const options = {
        key: "rzp_test_SiDxFKWZ89b1iB",
        amount: order.amount,
        currency: order.currency,
        name: "Giftora",
        description: `Order of ${cartItems.length} item(s)`,
        order_id: order.id,
        handler: async function (response) {
          // 4. Record order in database
          try {
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                total: Math.round(finalTotal),
                items: cartItems,
                shippingAddress: `${form.address1}${form.address2 ? ', ' + form.address2 : ''}, ${form.city}, ${form.state} - ${form.pincode}`,
              }),
            });
          } catch (err) {
            console.error("Failed to record order:", err);
          }

          // 5. Redirect to success page
          const params = new URLSearchParams({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            name: form.fullName,
            address: `${form.address1}${form.address2 ? ', ' + form.address2 : ''}, ${form.city}, ${form.state} - ${form.pincode}`,
            delivery: deliveryEstimate?.label || "5-7 business days",
            total: Math.round(finalTotal).toString(),
          });
          router.push(`/order-success?${params.toString()}`);
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
        },
        theme: {
          color: "#caa161",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#caa161]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#caa161] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left — Address Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address Section */}
          <div className="glass p-8 rounded-3xl border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#caa161]/15 rounded-xl text-[#caa161]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                <p className="text-sm text-gray-500">Enter your shipping address for gift delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full bg-gray-50 border ${errors.fullName ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all`}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full bg-gray-50 border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Address Line 1 *</label>
                <input
                  type="text"
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  placeholder="House/Flat No., Building, Street"
                  className={`w-full bg-gray-50 border ${errors.address1 ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all`}
                />
                {errors.address1 && <p className="text-xs text-red-500 mt-1">{errors.address1}</p>}
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Address Line 2 <span className="text-gray-400">(Optional)</span></label>
                <input
                  type="text"
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Landmark, Area"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className={`w-full bg-gray-50 border ${errors.city ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">State *</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className={`w-full bg-gray-50 border ${errors.state ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all`}
                />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className={`w-full bg-gray-50 border ${errors.pincode ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#caa161]/50 focus:border-transparent outline-none transition-all`}
                />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Estimate Card */}
          {deliveryEstimate && (
            <div className="glass p-6 rounded-3xl border border-green-200 bg-green-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl text-green-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{deliveryEstimate.speed}</h3>
                    {deliveryEstimate.isMetro && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Metro</span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    Estimated delivery by <span className="font-semibold text-gray-900">{deliveryEstimate.label}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {deliveryEstimate.isMetro 
                      ? "You're in a metro zone — enjoy faster delivery!" 
                      : "Standard delivery to your area"}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-gray-200">
              <Shield className="w-5 h-5 text-[#caa161] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-gray-200">
              <Package className="w-5 h-5 text-[#caa161] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Gift Wrapped</p>
                <p className="text-xs text-gray-500">Premium packaging included</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-gray-200">
              <Truck className="w-5 h-5 text-[#caa161] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders above ₹499</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-3xl border border-gray-200 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

            {/* Cart Items Mini Preview */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.srcset = ""; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3 mb-6 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="text-gray-900 font-medium">₹{Math.round(tax).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-900 font-medium">
                  {shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : `₹${shipping}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-[#9a7638]">₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#caa161]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Pay ₹{Math.round(finalTotal).toLocaleString('en-IN')}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-5 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
              <p className="text-xs text-gray-400">Powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
