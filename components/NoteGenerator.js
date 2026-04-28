"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Copy, CheckCircle2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function NoteGenerator() {
  const { giftNote: savedNote, setGiftNote } = useCart();
  const [recipient, setRecipient] = useState(savedNote?.recipient || "");
  const [occasion, setOccasion] = useState(savedNote?.occasion || "");
  const [tone, setTone] = useState(savedNote?.tone || "heartfelt");
  const [cardTheme, setCardTheme] = useState(savedNote?.theme || "elegant_gold");
  const [generatedNote, setGeneratedNote] = useState(savedNote?.message || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(!!savedNote);

  const isInitialMount = useRef(true);

  const generateNote = async (e) => {
    if (e) e.preventDefault();
    if (!recipient || !occasion) return;

    setIsGenerating(true);
    setGeneratedNote("");
    setIsSaved(false);
    setCopied(false);

    try {
      const response = await fetch("/api/ai/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          occasion,
          tone,
          variationId: Date.now() + Math.random() // Ensure no caching and fresh responses
        }),
      });

      const data = await response.json();
      
      if (data.success && data.text) {
        setGeneratedNote(data.text);
      } else {
        setGeneratedNote(getFallbackNote());
      }
    } catch (error) {
      setGeneratedNote(getFallbackNote());
    } finally {
      setIsGenerating(false);
    }
  };

  const generateNoteAuto = async () => {
    if (!recipient || !occasion) return;

    setIsGenerating(true);
    setGeneratedNote("");
    setIsSaved(false);
    setCopied(false);

    try {
      const response = await fetch("/api/ai/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          occasion,
          tone,
          variationId: Date.now() + Math.random() // Slight randomness to avoid repeated responses
        }),
      });

      const data = await response.json();
      
      if (data.success && data.text) {
        setGeneratedNote(data.text);
      } else {
        setGeneratedNote(getFallbackNote());
      }
    } catch (error) {
      setGeneratedNote(getFallbackNote());
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Only trigger when tone changes AFTER the first note has been generated
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (generatedNote && recipient && occasion) {
      generateNoteAuto();
    }
  }, [tone]);

  const getFallbackNote = () => {
    const notes = {
      heartfelt: `Dear ${recipient},\n\nWishing you the happiest ${occasion}! You mean the world to me, and I hope this small gift brings as much joy to you as you bring to my life.\n\nWith all my love.`,
      funny: `Hey ${recipient}!\n\nHappy ${occasion}! I was going to get you an expensive gift, but I figured my presence is a present in itself. Just kidding, enjoy this!\n\nCheers!`,
      professional: `Dear ${recipient},\n\nBest wishes on your ${occasion}. Hoping you have a wonderful day and enjoy this gift.\n\nWarmly.`
    };
    return notes[tone] || notes.heartfelt;
  };

  const handleSave = () => {
    if (!generatedNote.trim()) return;
    setGiftNote({
      recipient,
      occasion,
      tone,
      message: generatedNote,
      theme: cardTheme
    });
    setIsSaved(true);
    // Visual feedback
    const originalText = "Save Note";
    setTimeout(() => setIsSaved(true), 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeStyles = () => {
    const base = "h-full w-full rounded-[2.5rem] p-10 flex flex-col shadow-2xl transition-all duration-1000 relative overflow-hidden group/card";
    
    switch (cardTheme) {
      case "midnight_dark":
        return {
          container: `${base} bg-[#0a0a0c] text-gray-100 border border-white/10 font-sans`,
          buttonPrimary: "bg-white text-black",
          buttonSecondary: "bg-white/10 text-white",
          pattern: "opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
        };
      case "minimalist_white":
        return {
          container: `${base} bg-white text-gray-900 border border-gray-100 font-sans`,
          buttonPrimary: "bg-black text-white",
          buttonSecondary: "bg-gray-100 text-gray-900",
          pattern: "opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
        };
      case "romantic_heart":
        return {
          container: `${base} bg-gradient-to-br from-[#fff0f3] to-[#ffb3c1] text-[#c9184a] border border-[#ffb3c1] font-serif`,
          buttonPrimary: "bg-[#c9184a] text-white",
          buttonSecondary: "bg-[#c9184a]/10 text-[#c9184a]",
          pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/heart.png')]",
          extra: "❤️"
        };
      case "nature_calm":
        return {
          container: `${base} bg-gradient-to-br from-[#f1f8e9] to-[#c5e1a5] text-[#33691e] border border-[#c5e1a5] font-sans`,
          buttonPrimary: "bg-[#33691e] text-white",
          buttonSecondary: "bg-[#33691e]/10 text-[#33691e]",
          pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]",
          extra: "🌿"
        };
      case "celebration":
        return {
          container: `${base} bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] text-[#92400e] border border-[#fef3c7] font-bold`,
          buttonPrimary: "bg-[#92400e] text-white",
          buttonSecondary: "bg-[#92400e]/10 text-[#92400e]",
          pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/shattered.png')]",
          extra: "🎉"
        };
      case "elegant_gold":
      default:
        return {
          container: `${base} bg-[#faf8f5] text-[#9a7638] border border-[#caa161]/30 font-serif shadow-[0_40px_100px_rgba(202,161,97,0.15)]`,
          buttonPrimary: "bg-[#9a7638] text-white",
          buttonSecondary: "bg-[#9a7638]/10 text-[#9a7638]",
          pattern: "opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]",
          extra: "✨"
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="glass p-6 md:p-12 rounded-[3.5rem] relative overflow-hidden border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-full h-full bg-gradient-to-br from-[#caa161]/10 to-transparent rounded-full blur-[120px] opacity-30" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-black text-white rounded-[1.5rem] shadow-2xl rotate-3">
              <Sparkles className="w-8 h-8 text-[#caa161]" />
            </div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Giftora <span className="text-[#caa161]">Notes</span>
            </h3>
          </div>
          <p className="text-gray-500 font-medium max-w-sm">
            Our AI crafts deep, meaningful messages that turn a gift into a memory.
          </p>
        </div>
        
        <div className="flex bg-gray-100/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200">
           {['heartfelt', 'funny', 'professional'].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                tone === t
                  ? 'bg-white text-gray-900 shadow-lg scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
        <div className="xl:col-span-2 space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. My Amazing Mom"
                className="w-full bg-white/50 backdrop-blur-sm border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 text-gray-900 outline-none focus:border-[#caa161] focus:bg-white transition-all placeholder:text-gray-300 font-bold shadow-sm"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                Occasion
              </label>
              <input
                type="text"
                required
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. 50th Birthday"
                className="w-full bg-white/50 backdrop-blur-sm border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 text-gray-900 outline-none focus:border-[#caa161] focus:bg-white transition-all placeholder:text-gray-300 font-bold shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">
              Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'elegant_gold', label: 'Vintage Gold', color: 'bg-[#faf8f5]' },
                { id: 'romantic_heart', label: 'Romantic Heart', color: 'bg-[#fff0f3]' },
                { id: 'nature_calm', label: 'Nature Calm', color: 'bg-[#f1f8e9]' },
                { id: 'celebration', label: 'Celebration', color: 'bg-[#fffbeb]' },
                { id: 'midnight_dark', label: 'Onyx Black', color: 'bg-gray-900' },
                { id: 'minimalist_white', label: 'Pure Canvas', color: 'bg-white' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCardTheme(t.id)}
                  className={`flex items-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all duration-500 ${
                    cardTheme === t.id
                      ? 'border-[#caa161] bg-white shadow-xl scale-[1.02]'
                      : 'border-transparent bg-gray-50/50 hover:bg-gray-100/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full shadow-inner ${t.color}`} />
                  <span className={`text-[11px] font-black uppercase tracking-wider ${cardTheme === t.id ? 'text-[#9a7638]' : 'text-gray-400'}`}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateNote}
            disabled={isGenerating || !recipient || !occasion}
            className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] font-black text-xl tracking-tighter transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] group"
          >
            {isGenerating ? (
              <span className="flex items-center gap-4">
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                CRAFTING...
              </span>
            ) : (
              <>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                GENERATE MAGIC
              </>
            )}
          </button>
        </div>

        <div className="xl:col-span-3">
          <div className="relative group/wrapper perspective-1000">
             <div className="min-h-[500px] flex flex-col">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-200"
                  >
                    <div className="relative mb-8">
                      <div className="w-24 h-24 border-[6px] border-[#caa161]/10 border-t-[#caa161] rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sparkles className="w-10 h-10 text-[#caa161]" />
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-xl font-black text-[#caa161] animate-pulse uppercase tracking-[0.3em]">
                      Giftora is Thinking
                    </p>
                  </motion.div>
                ) : generatedNote ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 50, rotateX: 20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className={themeStyles.container}
                    >
                      {/* Theme-specific texture/pattern overlay */}
                      <div className={`absolute inset-0 z-0 pointer-events-none ${themeStyles.pattern}`} />
                      
                      {/* Artistic Background Elements for Card */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-current opacity-[0.03] rounded-full blur-3xl pointer-events-none group-hover/card:scale-150 transition-transform duration-1000" />
                      <div className="absolute top-12 left-12 w-1 h-12 bg-current opacity-20 rounded-full" />
                      
                      <div className="flex-1 flex flex-col relative z-10">
                         <div className="flex items-start justify-between mb-12">
                            <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">
                              {occasion} • {recipient}
                            </div>
                            <div className="text-2xl opacity-40">{themeStyles.extra || <Sparkles className="w-6 h-6" />}</div>
                         </div>
                        
                        <div className="flex-1 flex items-center pr-10">
                          <p className="text-2xl md:text-4xl font-medium leading-[1.4] italic tracking-tight">
                            "{generatedNote}"
                          </p>
                        </div>
  
                        <div className="mt-12 flex items-end justify-between border-t border-current/10 pt-8">
                          <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Generated by</div>
                            <div className="text-sm font-black tracking-tighter uppercase">Giftora AI</div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={generateNote}
                              className={`p-4 rounded-2xl transition-all hover:-translate-y-1 ${themeStyles.buttonSecondary}`}
                              title="Regenerate"
                            >
                              <Sparkles className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleSave}
                              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 ${isSaved ? 'bg-green-500 text-white' : themeStyles.buttonPrimary} font-black text-xs uppercase tracking-widest`}
                            >
                              {isSaved ? (
                                <><CheckCircle2 className="w-5 h-5" /> Message Attached</>
                              ) : (
                                <><Save className="w-5 h-5" /> Save to Cart</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-200 group-hover/wrapper:border-[#caa161]/30 transition-colors"
                  >
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-8 border border-gray-100"
                    >
                      <Sparkles className="w-12 h-12 text-[#caa161]/20" />
                    </motion.div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">The Perfect Note Awaits</h4>
                    <p className="text-gray-400 max-w-xs text-sm font-bold leading-relaxed uppercase tracking-widest opacity-60">
                      Fill the form to witness AI magic.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
