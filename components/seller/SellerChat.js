'use client';

import { useState } from 'react';
import { MessageCircle, Send, Phone, ExternalLink, Palette, Mic, X } from 'lucide-react';

const mockConversations = [
  {
    id: 1,
    buyer: 'Priya Sharma',
    avatar: 'PS',
    lastMessage: 'Can you customize this gift box with a photo?',
    time: '2 min ago',
    unread: 2,
    messages: [
      { role: 'buyer', text: 'Hi! I love the birthday gift box', time: '10:30 AM' },
      { role: 'buyer', text: 'Can you customize this gift box with a photo?', time: '10:31 AM' },
    ]
  },
  {
    id: 2,
    buyer: 'Rahul Verma',
    avatar: 'RV',
    lastMessage: 'What\'s the delivery time to Pune?',
    time: '15 min ago',
    unread: 0,
    messages: [
      { role: 'buyer', text: 'Hi, I want to order the chocolate hamper', time: '10:15 AM' },
      { role: 'seller', text: 'Sure! Which variant would you like?', time: '10:16 AM' },
      { role: 'buyer', text: 'The premium one. What\'s the delivery time to Pune?', time: '10:18 AM' },
    ]
  },
  {
    id: 3,
    buyer: 'Ananya Gupta',
    avatar: 'AG',
    lastMessage: 'Thanks! Will order soon 🎉',
    time: '1 hr ago',
    unread: 0,
    messages: [
      { role: 'buyer', text: 'Do you do same-day delivery?', time: '9:00 AM' },
      { role: 'seller', text: 'Yes! For orders before 2 PM in your city', time: '9:02 AM' },
      { role: 'buyer', text: 'Thanks! Will order soon 🎉', time: '9:05 AM' },
    ]
  },
];

export default function SellerChat() {
  const [activeChat, setActiveChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const sendReply = () => {
    if (!replyText.trim() || !activeChat) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, { role: 'seller', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
          lastMessage: replyText,
          time: 'Just now',
        };
      }
      return c;
    }));
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'seller', text: replyText, time: 'Just now' }]
    }));
    setReplyText('');
  };

  const openWhatsApp = (name) => {
    window.open(`https://wa.me/?text=Hi ${name}, regarding your order on Giftora...`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-charcoal">Buyer Messages</h3>
          <p className="text-xs font-bold text-gray-400">{conversations.filter(c => c.unread > 0).length} unread conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
        {/* Conversation List */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Conversations</p>
          </div>
          <div className="divide-y divide-gray-50">
            {conversations.map(conv => (
              <button key={conv.id} onClick={() => setActiveChat(conv)} className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${activeChat?.id === conv.id ? 'bg-secondary/5 border-l-4 border-secondary' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">{conv.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-charcoal text-sm truncate">{conv.buyer}</p>
                      <span className="text-[10px] font-bold text-gray-400 shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">{activeChat.avatar}</div>
                  <div>
                    <p className="font-bold text-charcoal text-sm">{activeChat.buyer}</p>
                    <p className="text-[10px] font-bold text-green-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openWhatsApp(activeChat.buyer)} className="p-2 hover:bg-green-50 rounded-xl transition-colors text-green-500" title="WhatsApp">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-primary/5 rounded-xl transition-colors text-primary" title="Customize Request">
                    <Palette className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar min-h-[300px] bg-gray-50/50">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'seller' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${msg.role === 'seller' ? 'msg-bubble sent' : 'msg-bubble received'}`}>
                      <p className="text-sm font-medium">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.role === 'seller' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-400" title="Voice (Coming soon)">
                  <Mic className="w-5 h-5" />
                </button>
                <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()} placeholder="Type a reply..." className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-primary outline-none text-sm font-bold" />
                <button onClick={sendReply} disabled={!replyText.trim()} className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-40">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-gray-300" />
                </div>
                <p className="font-bold text-gray-400">Select a conversation</p>
                <p className="text-xs text-gray-300 mt-1">Click on a buyer to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
