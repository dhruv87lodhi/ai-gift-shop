"use client";

import { useState } from "react";
import { Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NoteGenerator() {
  const [recipient, setRecipient] = useState("");
  const [occasion, setOccasion] = useState("");
  const [tone, setTone] = useState("heartfelt");
  const [cardTheme, setCardTheme] = useState("elegant_gold");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateNote = (e) => {
    e.preventDefault();
    if (!recipient || !occasion) return;

    setIsGenerating(true);
    setGeneratedNote("");

    // Simulated AI Generation
    setTimeout(() => {
      let note = "";
      if (tone === "heartfelt") {
        note = `Dear ${recipient},\n\nWishing you the happiest ${occasion}! You mean the world to me, and I hope this small gift brings as much joy to you as you bring to my life.\n\nWith all my love.`;
      } else if (tone === "funny") {
        note = `Hey ${recipient}!\n\nHappy ${occasion}! I was going to get you an expensive gift, but I figured my presence is a present in itself. Just kidding, enjoy this!\n\nCheers!`;
      } else {
        note = `Dear ${recipient},\n\nBest wishes on your ${occasion}. Hoping you have a wonderful day and enjoy this gift.\n\nWarmly.`;
      }
      setGeneratedNote(note);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeStyles = () => {
    switch (cardTheme) {
      case "midnight_dark":
        return "bg-black text-gray-300 border border-white/10 font-sans";
      case "minimalist_white":
        return "bg-white text-black border border-gray-200 font-sans";
      case "elegant_gold":
      default:
        return "bg-[#151515] text-[#caa161] border border-[#caa161]/50 font-serif";
    }
  };

  return (
    <div className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden border border-white/5">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#caa161] rounded-full mix-blend-screen filter blur-[100px] opacity-10 -z-10" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-[#caa161] to-[#b08a50] rounded-xl text-white shadow-lg shadow-[#caa161]/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">AI Note Generator</h3>
          <p className="text-sm text-gray-400">Craft a beautiful, personalized message to go with your gift.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={generateNote} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Who is this for?
              </label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Mom, Sarah, John"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#caa161] focus:border-transparent outline-none text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                What's the occasion?
              </label>
              <input
                type="text"
                required
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Birthday, Anniversary"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#caa161] focus:border-transparent outline-none text-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Writing Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['heartfelt', 'funny', 'professional'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                    tone === t
                      ? 'bg-[#caa161]/20 text-[#caa161] border border-[#caa161]'
                      : 'bg-[#111] text-gray-400 border border-white/5 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Theme (Visual Preview)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['elegant_gold', 'midnight_dark', 'minimalist_white'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCardTheme(t)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    cardTheme === t
                      ? 'bg-[#caa161]/20 text-[#caa161] border border-[#caa161]'
                      : 'bg-[#111] text-gray-400 border border-white/5 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !recipient || !occasion}
            className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#caa161]/20"
          >
            {isGenerating ? (
              <span className="animate-pulse flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin" /> Crafting your message...
              </span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Magic Note
              </>
            )}
          </button>
        </form>

        <div className="bg-[#111] rounded-2xl border border-white/5 p-6 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Note Card Preview
            </h4>
            {generatedNote && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] text-gray-300 rounded-lg transition-colors text-xs font-medium border border-white/5"
              >
                {copied ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy text</>
                )}
              </button>
            )}
          </div>
          
          <div className="flex-1 relative flex flex-col">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#caa161] rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-[#b08a50] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-3 h-3 bg-[#9a7638] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </motion.div>
              ) : generatedNote ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`h-full w-full rounded-2xl p-8 flex flex-col shadow-inner transition-colors duration-500 ${getThemeStyles()}`}
                >
                  <div className="flex-1 whitespace-pre-wrap italic text-lg leading-relaxed flex items-center">
                    "{generatedNote}"
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center text-center px-8"
                >
                  <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <p className="text-sm">
                      Fill out the details and hit generate to create a beautifully personalized gift note.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
