
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  X, 
  Settings, 
  Cpu, 
  Ghost, 
  Smile, 
  Zap, 
  CircuitBoard,
  Copy,
  Check,
  Lightbulb,
  Globe,
  MessageCircle
} from 'lucide-react';

interface AIAssistantProps {
  onBack: () => void;
}

interface AvatarOption {
  id: string;
  icon: React.ReactNode;
  color: string;
  name: string;
}

type Language = 'vi' | 'en';

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'classic', icon: <Bot size={20} />, color: 'bg-red-500', name: 'Smart Plus' },
  { id: 'friendly', icon: <Smile size={20} />, color: 'bg-emerald-500', name: 'Thân thiện' },
  { id: 'smart', icon: <Cpu size={20} />, color: 'bg-blue-500', name: 'Chuyên gia' },
  { id: 'dynamic', icon: <Zap size={20} />, color: 'bg-amber-500', name: 'Năng động' },
  { id: 'tech', icon: <CircuitBoard size={20} />, color: 'bg-indigo-500', name: 'Kỹ thuật' },
  { id: 'ghost', icon: <Ghost size={20} />, color: 'bg-slate-700', name: 'Tối giản' },
];

const SUGGESTIONS = {
  vi: [
    "Dạ, làm Khai sinh cần gì?",
    "Thủ tục Đăng ký kết hôn?",
    "Chứng thực bản sao ở đâu?",
    "Làm xác nhận độc thân?"
  ],
  en: [
    "Birth registration process?",
    "Marriage registration?",
    "Notarization services?",
    "Marital status certificate?"
  ]
};

const UI_TEXT = {
  vi: {
    title: 'Trợ lý',
    placeholder: 'Dạ, ông/bà cần hỏi gì ạ...',
    thinking: 'AI đang tra cứu quy định...',
    welcome: 'Kính chào ông/bà! Tôi là Trợ lý ảo AI của UBND Phường Tây Thạnh. Ông/bà cần hướng dẫn về thủ tục hành chính nào (Khai sinh, Kết hôn, Chứng thực...) không ạ?',
    confirm: 'Xác nhận',
    personalization: 'Cá nhân hóa AI',
    error: 'Dạ, thành thật xin lỗi ông/bà, kết nối đang bận. Để được hỗ trợ ngay, kính mời ông/bà nhắn Zalo OA Phường: https://zalo.me/1358120320651896785'
  },
  en: {
    title: 'Assistant',
    placeholder: 'How can I help you...',
    thinking: 'AI is looking up regulations...',
    welcome: 'Welcome! I am the AI Assistant of Tay Thanh Ward. How can I assist you with administrative procedures today?',
    confirm: 'Confirm',
    personalization: 'AI Personalization',
    error: 'Sorry, the connection is busy. Please contact our Zalo OA for support: https://zalo.me/1358120320651896785'
  }
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [lang, setLang] = useState<Language>('vi');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: UI_TEXT['vi'].welcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(AVATAR_OPTIONS[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      const reply = await geminiService.sendMessage(messages, textToSend);
      setMessages(prev => [...prev, { role: 'model', text: reply || UI_TEXT[lang].error }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: UI_TEXT[lang].error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      let cleanLine = line.replace(/[*#]/g, '').trim();
      if (!cleanLine) return <div key={index} className="h-2" />;
      
      const isBullet = line.trim().startsWith('-') || line.trim().match(/^\d\./);
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = cleanLine.split(urlRegex);

      return (
        <div key={index} className={`mb-1 last:mb-0 ${isBullet ? 'pl-3 border-l-2 border-red-500/20 bg-slate-50/50 py-1' : ''}`}>
          {parts.map((p, i) => urlRegex.test(p) 
            ? <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-black break-all">{p}</a> 
            : p
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-red-600 text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="bg-white p-1.5 rounded-xl text-red-600 shadow-sm transition-transform active:scale-95"
            >
              <div className={selectedAvatar.color + " p-1 rounded-lg text-white"}>
                {selectedAvatar.icon}
              </div>
            </button>
            <div>
              <h3 className="font-bold text-sm leading-tight">{selectedAvatar.name} AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-[9px] text-white/80 font-black uppercase tracking-widest">Trực tuyến 24/7</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex bg-red-700/50 p-1 rounded-xl border border-white/10">
          <button onClick={() => setLang('vi')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'vi' ? 'bg-white text-red-600 shadow-sm' : 'text-white/60'}`}>VN</button>
          <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-white text-red-600 shadow-sm' : 'text-white/60'}`}>EN</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1 ${
                m.role === 'user' ? 'bg-red-500 text-white' : `${selectedAvatar.color} text-white`
              }`}>
                {m.role === 'user' ? <User size={16} /> : selectedAvatar.icon}
              </div>
              <div className="relative group">
                <div className={`px-4 py-3 rounded-[20px] text-[13.5px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {formatMessageContent(m.text)}
                </div>
                {m.role === 'model' && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(m.text);
                      setCopiedIndex(i);
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                    className="absolute -bottom-6 left-2 p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    {copiedIndex === i ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 items-center">
              <div className={`w-8 h-8 rounded-lg ${selectedAvatar.color} text-white flex items-center justify-center shadow-sm animate-bounce`}>
                <Sparkles size={16} />
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{UI_TEXT[lang].thinking}</span>
                <Loader2 size={12} className="animate-spin text-red-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white space-y-3">
        {messages.length < 5 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTIONS[lang].map((s, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(s)}
                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full whitespace-nowrap text-[11px] font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[24px] items-center border border-slate-200 focus-within:ring-2 focus-within:ring-red-500/10 focus-within:bg-white transition-all shadow-inner">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={UI_TEXT[lang].placeholder} 
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-slate-700 font-bold"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all disabled:opacity-40 shadow-lg shadow-red-600/20 active:scale-90"
          >
            <Send size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      {showAvatarPicker && (
        <div className="absolute inset-0 z-[100] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-900">{UI_TEXT[lang].personalization}</h4>
              <button onClick={() => setShowAvatarPicker(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => { setSelectedAvatar(opt); setShowAvatarPicker(false); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${selectedAvatar.id === opt.id ? 'border-red-600 bg-red-50' : 'border-slate-50'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${opt.color} text-white`}>{opt.icon}</div>
                  <span className="text-[10px] font-bold text-slate-600">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </div>
  );
};
