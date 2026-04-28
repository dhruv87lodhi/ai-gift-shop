import Link from "next/link";
import { Sparkles, ArrowRight, Gift, User, ShieldCheck, Truck, RotateCcw, Headphones, Star, Heart } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Chatbot from "@/components/Chatbot";
import { categories } from "@/data/mockData";
import Image from "next/image";

export default async function Home() {
  let featuredProducts = [];
  try {
    const res = await fetch("http://127.0.0.1:8000/recommend?query=trending", { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      featuredProducts = data.recommendations.slice(0, 4);
    }
  } catch (err) {
    console.error("Failed to fetch trending products:", err);
  }

  const features = [
    { title: "AI Gift Finder", desc: "Smart recommendations just for you", icon: <Sparkles className="w-6 h-6 text-primary" />, bg: "bg-primary/10" },
    { title: "Personalized Gifts", desc: "Unique & customized for every moment", icon: <User className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
    { title: "Wide Selection", desc: "Thousands of gifts for everyone", icon: <Gift className="w-6 h-6 text-orange-500" />, bg: "bg-orange-50" },
    { title: "Secure Shopping", desc: "100% safe & secure payments", icon: <ShieldCheck className="w-6 h-6 text-green-500" />, bg: "bg-green-50" },
  ];

  const categoryList = [
    { id: 1, name: "Personalized Gifts", image: "/cat_personalized.png" },
    { id: 2, name: "For Her", image: "/cat_for_her.png" },
    { id: 3, name: "For Him", image: "/cat_for_him.png" },
    { id: 4, name: "Home & Living", image: "/cat_for_her.png" }, // Reusing for now
    { id: 5, name: "Chocolates", image: "/cat_personalized.png" }, // Reusing for now
    { id: 6, name: "Cards & More", image: "/cat_for_him.png" }, // Reusing for now
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-24 overflow-hidden bg-ivory">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6 text-sm font-bold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI POWERED
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-charcoal leading-[1.1] mb-6">
              The Perfect <span className="text-primary italic">Gift</span>,<br />
              For Every Person,<br />
              <span className="text-secondary">Every Occasion</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              Let our AI find the most thoughtful gifts tailored just for your loved ones.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover transition-all transform hover:scale-105 shadow-xl shadow-primary/25 flex items-center justify-center gap-3 group">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Find My Gift
              </button>
              <Link href="/products" className="w-full sm:w-auto px-10 py-5 border-2 border-primary/20 text-primary rounded-full font-bold text-lg hover:bg-primary/5 transition-colors flex items-center justify-center">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in lg:block hidden">
            {/* Main Hero Image */}
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="/hero.png" 
                alt="Perfect Gift" 
                width={800} 
                height={800} 
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-float">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Personalized</p>
                <p className="text-sm font-black text-charcoal">AI Recommended</p>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -left-10 bg-white p-5 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-float" style={{ animationDelay: '2s' }}>
              <div className="bg-primary/10 p-3 rounded-full">
                <Heart className="w-6 h-6 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Perfect Match</p>
                <p className="text-base font-black text-charcoal">Highly Recommended</p>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full -z-10 blur-3xl animate-pulse-slow" />
          </div>
        </div>
      </section>

      {/* Feature Row */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className={`${f.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-charcoal text-sm md:text-base leading-tight">{f.title}</h3>
                <p className="text-xs text-gray-400 font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4">Shop By Category</h2>
            <div className="flex items-center justify-center gap-4 text-primary">
              <div className="h-px w-12 bg-primary/30" />
              <Gift className="w-5 h-5" />
              <div className="h-px w-12 bg-primary/30" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryList.map((cat) => (
              <Link href={`/category?q=${cat.name}`} key={cat.id} className="group flex flex-col items-center bg-[#fff8f8] p-3 rounded-[2.5rem] transition-all duration-500 hover:shadow-xl hover:shadow-primary/10">
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-primary/20 bg-white">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-bold text-charcoal group-hover:text-primary transition-colors text-center pb-2 px-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Gift Finder Promo */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden bg-[#f3f0ff] relative shadow-2xl border border-white">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 md:p-16">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                <Image src="/robot.png" alt="AI Robot" fill className="object-contain" />
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-primary font-black uppercase tracking-widest text-sm mb-3">AI Gift Finder</p>
                <h2 className="text-4xl md:text-5xl font-black text-charcoal">Not Sure What to Gift?</h2>
                <p className="text-gray-600 mt-4 text-lg">Let our AI help you find the perfect gift in seconds!</p>
              </div>
              
              <div className="space-y-3">
                {["Who is the gift for?", "What's the occasion?", "What's your budget?"].map((text, i) => (
                  <div key={i} className="flex justify-end">
                    <div className="bg-white px-6 py-3 rounded-2xl rounded-tr-none shadow-sm text-charcoal font-bold text-sm md:text-base border border-gray-100 animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                      {text}
                    </div>
                  </div>
                ))}
                <div className="flex justify-start">
                  <div className="bg-primary text-white px-6 py-3 rounded-2xl rounded-tl-none shadow-lg font-bold text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    Here are the perfect gifts for you! 🎁
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Find My Perfect Gift
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Picks */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4">Popular Picks</h2>
          <div className="flex items-center justify-center gap-4 text-primary">
            <div className="h-px w-12 bg-primary/30" />
            <Gift className="w-5 h-5" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
             <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-bold">Connecting to AI recommendations...</p>
             </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-primary font-black hover:gap-4 transition-all">
            View All Collections <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Bottom Service Row */}
      <section className="py-12 bg-soft-ivory border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: "Free Shipping", desc: "On orders above ₹499", icon: <Truck className="w-6 h-6 text-primary" /> },
            { title: "Easy Returns", desc: "Hassle-free returns", icon: <RotateCcw className="w-6 h-6 text-primary" /> },
            { title: "Secure Payments", desc: "Multiple payment options", icon: <ShieldCheck className="w-6 h-6 text-primary" /> },
            { title: "24/7 Support", desc: "We're here to help", icon: <Headphones className="w-6 h-6 text-primary" /> },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                {s.icon}
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-sm">{s.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chatbot Component (Floating) */}
      <Chatbot />
    </div>
  );
}
