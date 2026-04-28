import Link from "next/link";
import { Sparkles, ArrowRight, Gift, User, ShieldCheck, Truck, RotateCcw, Headphones, Star, Heart } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { categories, occasions } from "@/data/mockData";
import OccasionCard from "@/components/OccasionCard";
import Image from "next/image";
import HeroButtons from "@/components/HeroButtons";

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
    { id: 1, name: "Personalized Gifts", image: "https://i.pinimg.com/1200x/09/6f/2d/096f2dcd7b01d25fa9f5a29238c68866.jpg" },
    { id: 2, name: "For Her", image: "https://i.pinimg.com/1200x/3f/fe/7a/3ffe7a27a3188bcb246d77cb309cbb80.jpg" },
    { id: 3, name: "For Him", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800" },
    { id: 4, name: "Home & Living", image: "https://i.pinimg.com/1200x/de/73/55/de73557edef04e75ce259e748dddd024.jpg" },
    { id: 5, name: "Chocolates", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800" },
    { id: 6, name: "Cards & More", image: "https://i.pinimg.com/1200x/8e/4e/62/8e4e62568cc900bb0e06a030f10728bc.jpg" },
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
            
            <HeroButtons />
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
      <section id="categories" className="py-24 px-6 bg-white">
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
          
          {/* View All Link (Standardized) */}
          <div className="mt-16 text-center">
            <Link href="/category" className="inline-flex items-center gap-2 text-primary font-black hover:gap-4 transition-all group">
              View All Categories <ArrowRight className="w-6 h-6 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Shop By Occasion */}
      <section className="py-24 px-6 bg-soft-ivory relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4">Shop By Occasion</h2>
            <div className="flex items-center justify-center gap-4 text-primary">
              <div className="h-px w-12 bg-primary/30" />
              <Sparkles className="w-5 h-5" />
              <div className="h-px w-12 bg-primary/30" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {occasions.map((occasion) => (
              <OccasionCard key={occasion.id} occasion={occasion} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/occasion" className="inline-flex items-center gap-2 text-primary font-black hover:gap-4 transition-all group">
              View All Occasions <ArrowRight className="w-6 h-6 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Festival Banner Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto rounded-[3.5rem] overflow-hidden bg-charcoal relative shadow-2xl group">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30">
            <div className="absolute top-10 right-20 w-32 h-32 bg-primary rounded-full blur-[80px] animate-pulse" />
            <div className="absolute bottom-10 left-20 w-48 h-48 bg-secondary rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center">
            {/* Image side with overlay */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800" 
                alt="Festive Celebrations" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/40 to-transparent lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:hidden block" />
            </div>

            {/* Content side */}
            <div className="w-full lg:w-1/2 p-10 lg:p-20 space-y-8 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                Seasonal Highlights
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                Celebrate the <br/>
                <span className="text-primary italic">Festival</span> of Giving
              </h2>
              
              <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
                Discover our curated collection of festive treasures designed to bring light and joy to your loved ones this season.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/products?q=festival" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:bg-white hover:text-charcoal transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="flex -space-x-3 items-center">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
                    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100"
                  ].map((url, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-charcoal overflow-hidden bg-gray-800 relative">
                      <Image src={url} alt="User" fill className="object-cover" />
                    </div>
                  ))}
                  <span className="ml-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Join 10k+ Gifters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Gifts */}
      <section id="trending-gifts" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4">Trending Gifts</h2>
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
          <Link href="/ai?q=trending" className="inline-flex items-center gap-2 text-primary font-black hover:gap-4 transition-all group">
            View Trending Gifts <ArrowRight className="w-6 h-6 group-hover:translate-x-1" />
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
    </div>
  );
}
