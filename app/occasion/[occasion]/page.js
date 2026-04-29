import Link from "next/link";
import { ArrowLeft, Sparkles, Gift, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/mockData";
import { globalOccasions } from "@/data/globalOccasions";
import Chatbot from "@/components/Chatbot";

// ── Slug → display name helper ─────────────────────────────────────────────
function slugToName(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Find the matching global occasion ──────────────────────────────────────
function findOccasion(slug) {
  // Try exact match via re-slugging each occasion name
  return globalOccasions.find((occ) => {
    const occSlug = occ.name
      .toLowerCase()
      .replace(/[''']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return occSlug === slug;
  }) || null;
}

// ── Occasion-specific theme map ────────────────────────────────────────────
const themeMap = {
  "Valentine's Day": {
    emoji: "💝",
    gradient: "from-[#5c0028] via-[#a01050] to-[#cc2060]",
    tagline: "Love is the greatest gift",
  },
  "Mother's Day": {
    emoji: "💐",
    gradient: "from-[#5c1a00] via-[#a04020] to-[#d4836a]",
    tagline: "Celebrate the woman who loves you most",
  },
  "Father's Day": {
    emoji: "👔",
    gradient: "from-[#001a3d] via-[#003380] to-[#0055cc]",
    tagline: "For the man who gave you everything",
  },
  "Diwali": {
    emoji: "🪔",
    gradient: "from-[#3d1a00] via-[#8b4500] to-[#caa161]",
    tagline: "Festival of Lights & Love",
  },
  "Christmas": {
    emoji: "🎄",
    gradient: "from-[#001a00] via-[#003300] to-[#005500]",
    tagline: "The season of giving",
  },
  "Holi": {
    emoji: "🌈",
    gradient: "from-[#7c1a00] via-[#cc4400] to-[#ff8800]",
    tagline: "Celebrate colours of joy",
  },
  "Raksha Bandhan": {
    emoji: "🎗️",
    gradient: "from-[#4a1a00] via-[#8b3a0a] to-[#caa161]",
    tagline: "A bond beyond words",
  },
};
const defaultTheme = {
  emoji: "🎁",
  gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
  tagline: "Every day is a reason to gift",
};

// ── Fetch recommended products from existing AI service ─────────────────────
async function fetchRecommendations(occasionName) {
  try {
    const query = encodeURIComponent(occasionName);
    const res = await fetch(
      `http://127.0.0.1:8000/recommend?query=${query}`,
      { next: { revalidate: 120 } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.recommendations || [];
    }
  } catch {
    // silently fall through to local fallback
  }
  return [];
}

// ── Local fallback: filter mockData products by occasion ID ─────────────────
function getLocalProducts(slug) {
  // Map slug to possible occasion IDs from mockData
  const idMap = {
    "valentines-day": "valentines",
    "mothers-day": "anniversary", // best match for "celebration"
    "fathers-day": "birthday",
    "birthday": "birthday",
    "anniversary": "anniversary",
    "wedding": "wedding",
    "graduation": "graduation",
  };
  const occasionId = idMap[slug] || slug.replace(/-/g, "");
  const filtered = products.filter((p) =>
    p.occasions?.includes(occasionId)
  );
  return filtered.length > 0 ? filtered : products.slice(0, 6);
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function OccasionPage({ params }) {
  const { occasion: slug } = await params;
  const displayName = slugToName(slug);
  const occInfo = findOccasion(slug);
  const finalName = occInfo?.name || displayName;

  const theme = themeMap[finalName] || defaultTheme;

  // Fetch from existing recommendation system
  let aiProducts = await fetchRecommendations(finalName);
  const hasAI = aiProducts.length > 0;
  const displayProducts = hasAI ? aiProducts.slice(0, 8) : getLocalProducts(slug);

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className={`relative bg-gradient-to-br ${theme.gradient} pt-36 pb-20 px-6 overflow-hidden`}>
        {/* Glow orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-bold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#caa161]" />
              {occInfo?.type ?? "Special"} Occasion
            </span>
          </div>

          <div className="text-7xl mb-4">{theme.emoji}</div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-4">
            {finalName}
          </h1>

          <p className="text-white/70 text-xl font-medium max-w-xl mx-auto mb-2">
            {theme.tagline}
          </p>

          <p className="text-white/50 text-sm">
            {displayProducts.length} curated{" "}
            {hasAI ? "AI-recommended" : "handpicked"} gifts
          </p>
        </div>
      </div>

      {/* ── Product Grid ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Gift className="w-4 h-4" />
            {hasAI ? "AI Curated Picks" : "Featured Gifts"}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-charcoal">
            Perfect gifts for{" "}
            <span className="text-primary italic">{finalName}</span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-primary mt-4">
            <div className="h-px w-12 bg-primary/30" />
            <Sparkles className="w-4 h-4" />
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product, i) => (
              <ProductCard key={product.id ?? i} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-lg">
              No products found for this occasion.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors"
            >
              Browse All Gifts
            </Link>
          </div>
        )}

        {/* Explore more CTA */}
        <div className="mt-16 text-center">
          <Link
            href={`/ai?q=${encodeURIComponent(finalName + " gifts")}`}
            className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-white rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-xl group"
          >
            <Sparkles className="w-5 h-5" />
            Ask AI for More {finalName} Gift Ideas
          </Link>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
