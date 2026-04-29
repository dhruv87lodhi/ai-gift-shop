'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, TrendingUp, Tag, Calendar, Lightbulb } from 'lucide-react';

const quickPrompts = [
  { label: 'What should I sell this week?', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Suggest trending gifts', icon: <Sparkles className="w-4 h-4" /> },
  { label: 'Suggest price for my product', icon: <Tag className="w-4 h-4" /> },
  { label: 'What festivals are coming up?', icon: <Calendar className="w-4 h-4" /> },
];

export default function SellerAIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your Giftora Seller AI Assistant 🎁\n\nI can help you with:\n• What to sell this week\n• Trending gift suggestions\n• Pricing recommendations\n• Seasonal planning\n\nAsk me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const query = text || input;
    if (!query.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/seller-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context: 'Gift shop seller on Giftora platform' }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response || 'Sorry, I could not process that. Please try again.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops! Connection issue. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 seller-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-charcoal">Seller AI Assistant</h3>
          <p className="text-xs font-bold text-gray-400">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p.label)} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 bg-secondary/5 border border-secondary/10 rounded-xl text-xs font-bold text-secondary hover:bg-secondary/10 transition-all disabled:opacity-50">
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-50 rounded-[2rem] p-6 min-h-[400px] max-h-[500px] overflow-y-auto no-scrollbar space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'msg-bubble sent' : 'msg-bubble received'}`}>
              <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="msg-bubble received flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about selling..."
          className="flex-1 px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-bold text-charcoal text-sm"
          disabled={loading}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="px-6 py-4 seller-gradient text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-40">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
