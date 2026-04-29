"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { globalOccasions } from "@/data/globalOccasions";
import Image from "next/image";

// ── Slug helper ───────────────────────────────────────────────────────────────
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Per-occasion config (image + copy + overlay) ─────────────────────────────
const OCCASION_CONFIG = {
  "New Year's Day": {
    emoji: "🎆",
    image: "/banners/new-years-day.png",
    overlay: "from-[#05050f]/85 via-[#0a0a20]/60 to-transparent",
    accent: "#7c5cfc",
    tagline: "Start the year with love",
    message: "Ring in the New Year with a gift they'll treasure forever.",
    chip: "bg-violet-500/20 text-violet-200 border-violet-400/30",
  },
  "Valentine's Day": {
    emoji: "💝",
    image: "/banners/valentines-day.png",
    overlay: "from-[#1a0010]/90 via-[#3d0025]/60 to-transparent",
    accent: "#ff4d88",
    tagline: "Love is the greatest gift",
    message: "Make your love story unforgettable with something truly special.",
    chip: "bg-rose-500/20 text-rose-200 border-rose-400/30",
  },
  "Women's Day": {
    emoji: "💐",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1400",
    overlay: "from-[#2a0040]/90 via-[#5a1060]/60 to-transparent",
    accent: "#d63091",
    tagline: "Celebrate every woman",
    message: "Honor the extraordinary women in your life with a heartfelt gift.",
    chip: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30",
  },
  "Holi": {
    emoji: "🌈",
    image: "/banners/holi.png",
    overlay: "from-[#1a0800]/85 via-[#3d1500]/55 to-transparent",
    accent: "#ff8800",
    tagline: "Celebrate colours of joy",
    message: "Spread happiness and colours with thoughtful gifting this Holi.",
    chip: "bg-orange-500/20 text-orange-200 border-orange-400/30",
  },
  "Eid al-Fitr": {
    emoji: "🌙",
    image: "/banners/eid-al-fitr.png",
    overlay: "from-[#001a10]/90 via-[#003320]/60 to-transparent",
    accent: "#00cc88",
    tagline: "Eid Mubarak to all",
    message: "Share the spirit of Eid with gifts that carry your warmest wishes.",
    chip: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  },
  "Mother's Day": {
    emoji: "💐",
    image: "/banners/mothers-day.png",
    overlay: "from-[#1a0808]/90 via-[#3d1010]/55 to-transparent",
    accent: "#caa161",
    tagline: "Celebrate the woman who loves you unconditionally",
    message: "Make her feel truly loved with a thoughtful gift she'll cherish.",
    chip: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  },
  "Father's Day": {
    emoji: "👔",
    image: "/banners/fathers-day.png",
    overlay: "from-[#020d1a]/90 via-[#051a33]/60 to-transparent",
    accent: "#4d9fff",
    tagline: "For the man who gave you everything",
    message: "Show Dad how much he means with a gift worth remembering.",
    chip: "bg-blue-500/20 text-blue-200 border-blue-400/30",
  },
  "Raksha Bandhan": {
    emoji: "🎗️",
    image: "/banners/raksha-bandhan.png",
    overlay: "from-[#1a0c00]/90 via-[#3d1c00]/55 to-transparent",
    accent: "#caa161",
    tagline: "A bond beyond words",
    message: "Celebrate the eternal bond between brothers and sisters.",
    chip: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
  },
  "Independence Day (India)": {
    emoji: "🇮🇳",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=1400",
    overlay: "from-[#001a00]/90 via-[#002600]/60 to-transparent",
    accent: "#ff9933",
    tagline: "Jai Hind — celebrate freedom",
    message: "Gift the spirit of India — pride, love and togetherness.",
    chip: "bg-orange-500/20 text-orange-200 border-orange-400/30",
  },
  "Dussehra": {
    emoji: "🏹",
    image: "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&q=80&w=1400",
    overlay: "from-[#1a0500]/90 via-[#3d1000]/60 to-transparent",
    accent: "#ff6600",
    tagline: "Victory of good over evil",
    message: "Celebrate the triumph of light with gifts that spread joy.",
    chip: "bg-orange-600/20 text-orange-200 border-orange-400/30",
  },
  "Diwali": {
    emoji: "🪔",
    image: "/banners/diwali.png",
    overlay: "from-[#1a0c00]/90 via-[#3d1800]/55 to-transparent",
    accent: "#caa161",
    tagline: "Festival of Lights & Love",
    message: "Illuminate lives with the warmth of thoughtful Diwali gifts.",
    chip: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  },
  "Christmas": {
    emoji: "🎄",
    image: "/banners/christmas.png",
    overlay: "from-[#010d01]/90 via-[#021a04]/60 to-transparent",
    accent: "#cc3333",
    tagline: "The season of giving",
    message: "Wrap your love in every gift this magical Christmas season.",
    chip: "bg-red-600/20 text-red-200 border-red-400/30",
  },
};

const DEFAULT_CONFIG = {
  emoji: "🎁",
  image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1400",
  overlay: "from-[#0a0a0a]/90 via-[#1a1a1a]/60 to-transparent",
  accent: "#caa161",
  tagline: "Every day is a reason to gift",
  message: "Discover handpicked gifts for every special moment.",
  chip: "bg-white/10 text-white/80 border-white/20",
};

// ── Filter: within 1–45 days; fallback to nearest 3 if empty ─────────────────
function getFilteredOccasions() {
  const now = new Date();
  const year = now.getFullYear();

  const withDates = globalOccasions.map((occ) => {
    const [m, d] = occ.date.split("-").map(Number);
    let dt = new Date(year, m - 1, d);
    if (dt <= now) dt = new Date(year + 1, m - 1, d);
    const days = Math.ceil((dt - now) / 86400000);
    return { ...occ, daysUntil: days };
  });

  const sorted = [...withDates].sort((a, b) => a.daysUntil - b.daysUntil);

  // Primary filter: 1–45 days (≈ 1.5 months)
  const inWindow = sorted.filter((o) => o.daysUntil >= 1 && o.daysUntil <= 45);

  // Fallback: at least show 2 nearest upcoming occasions
  return inWindow.length >= 1 ? inWindow : sorted.slice(0, 2);
}

// ── Countdown label ───────────────────────────────────────────────────────────
function countdownLabel(days) {
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days away`;
  if (days < 14) return `1 week away`;
  const weeks = Math.floor(days / 7);
  return `${weeks} weeks away`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function FestivalBanner() {
  const router = useRouter();
  const [occasions] = useState(() => getFilteredOccasions());
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = occasions.length;
  const current = occasions[idx];
  const cfg = OCCASION_CONFIG[current?.name] || DEFAULT_CONFIG;

  const goNext = useCallback(() => {
    setDir(1);
    setIdx((p) => (p + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDir(-1);
    setIdx((p) => (p - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext, paused, total]);

  if (!current) return null;

  const slug = toSlug(current.name);

  // Slide variants for text content
  const textVariants = {
    enter: (d) => ({ opacity: 0, y: d > 0 ? 40 : -40 }),
    center: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit: (d) => ({ opacity: 0, y: d > 0 ? -30 : 30, transition: { duration: 0.3 } }),
  };

  return (
    <div className="w-full px-4 md:px-8 py-10">
      {/* ── Section tagline header ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Upcoming This Season
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-charcoal leading-tight">
            {occasions.length === 1
              ? <>
                  <span className="text-primary italic">{current.name} {cfg.emoji}</span>
                  {" "}is coming up — don't miss it
                </>
              : <>
                  <span className="text-primary italic">{current.name}</span>
                  <span className="text-charcoal/40 font-medium text-xl ml-2">+{occasions.length - 1} more</span>
                  {" "}— gift ideas curated for you
                </>
            }
          </h2>
        </div>

        {/* Occasion pill strip */}
        {occasions.length > 1 && (
          <div className="hidden md:flex items-center gap-2">
            {occasions.slice(0, 5).map((occ, i) => {
              const c = OCCASION_CONFIG[occ.name] || DEFAULT_CONFIG;
              return (
                <button
                  key={occ.name}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                    i === idx
                      ? "bg-charcoal text-white border-charcoal scale-105"
                      : "bg-white text-gray-500 border-gray-200 hover:border-charcoal/30"
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span className="hidden lg:inline">{occ.name.split(" ")[0]}</span>
                  <span className="opacity-60 text-[10px]">{occ.daysUntil}d</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Main Banner Card ─────────────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
        style={{ minHeight: "600px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background image layer */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`img-${idx}`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={cfg.image}
              alt={current.name}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Directional gradient overlay */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`overlay-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 z-10 bg-gradient-to-r ${cfg.overlay}`}
          />
        </AnimatePresence>

        {/* Subtle vignette always on */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* ── Content Layout: editorial 2-column ── */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[55%_1fr] min-h-[600px]">

          {/* Left — Main editorial text column */}
          <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">

            {/* Top row: chip + countdown */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`top-${idx}`}
                custom={dir}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex items-center gap-3 flex-wrap"
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest backdrop-blur-md ${cfg.chip}`}
                >
                  <Sparkles className="w-3 h-3" />
                  {current.type} Occasion
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest">
                  <CalendarDays className="w-3 h-3" />
                  {countdownLabel(current.daysUntil)}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Centre: title + message */}
            <div className="my-auto py-10">
              {/* Overline */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.p
                  key={`over-${idx}`}
                  custom={dir}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4"
                  style={{ color: cfg.accent }}
                >
                  {cfg.tagline}
                </motion.p>
              </AnimatePresence>

              {/* Main heading */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.h2
                  key={`h2-${idx}`}
                  custom={dir}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                  className="text-5xl md:text-[4.5rem] lg:text-[5rem] font-black text-white leading-[0.95] tracking-tighter mb-6"
                >
                  Celebrate<br />
                  <span style={{ color: cfg.accent }}>{current.name}</span>
                  <span className="ml-3 text-5xl">{cfg.emoji}</span>
                </motion.h2>
              </AnimatePresence>

              {/* Body copy */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.p
                  key={`body-${idx}`}
                  custom={dir}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                  className="text-white/65 text-lg md:text-xl font-medium leading-relaxed max-w-lg"
                >
                  {cfg.message}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Bottom: CTA + nav arrows */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`cta-${idx}`}
                custom={dir}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.12 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <button
                  onClick={() => router.push(`/ai?q=${encodeURIComponent(current.name + " gifts")}`)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-2xl hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: cfg.accent, color: "#fff", boxShadow: `0 12px 40px ${cfg.accent}55` }}
                >
                  Explore Gifts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>

                {/* Prev / Next */}
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={goPrev}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goNext}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — editorial sidebar panel */}
          <div className="hidden lg:flex flex-col justify-end pb-12 pr-12 gap-4">

            {/* Occasion date display card */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`side-${idx}`}
                custom={dir}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, delay: 0.1 }}
                className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-6 mb-4"
              >
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Next Occasion
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0"
                    style={{ background: `${cfg.accent}22`, border: `1.5px solid ${cfg.accent}44` }}
                  >
                    {cfg.emoji}
                  </div>
                  <div>
                    <p className="text-white font-black text-base leading-tight">{current.name}</p>
                    <p className="text-white/50 text-xs font-medium mt-0.5">{countdownLabel(current.daysUntil)}</p>
                  </div>
                </div>

                {/* Thin accent divider */}
                <div className="mt-4 h-px bg-white/10" />

                {/* Next in queue */}
                {occasions.length > 1 && (
                  <div className="mt-3">
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">Also coming</p>
                    <div className="flex flex-col gap-2">
                      {occasions.slice(1, 3).map((occ) => {
                        const oc = OCCASION_CONFIG[occ.name] || DEFAULT_CONFIG;
                        return (
                          <button
                            key={occ.name}
                            onClick={() => { setDir(1); setIdx(occasions.indexOf(occ)); }}
                            className="flex items-center gap-2 group text-left hover:bg-white/5 rounded-xl px-2 py-1.5 transition-all"
                          >
                            <span className="text-base">{oc.emoji}</span>
                            <span className="text-white/60 group-hover:text-white text-xs font-bold transition-colors flex-1">{occ.name}</span>
                            <span className="text-white/30 text-[10px]">{occ.daysUntil}d</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex justify-end gap-1.5 px-2">
              {occasions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === idx ? 28 : 8,
                    height: 8,
                    background: i === idx ? cfg.accent : "rgba(255,255,255,0.25)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Auto-progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-white/10">
          <motion.div
            key={`bar-${idx}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? undefined : 1 }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full origin-left"
            style={{ background: cfg.accent }}
          />
        </div>
      </div>

      {/* ── Mobile dot nav ── */}
      <div className="flex lg:hidden justify-center gap-2 mt-5">
        {occasions.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 24 : 8,
              height: 8,
              background: i === idx ? "#caa161" : "rgba(0,0,0,0.2)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
