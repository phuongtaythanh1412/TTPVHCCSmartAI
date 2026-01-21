
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const LegalChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Dạ, kính chào ông/bà! Tôi là Trợ lý ảo AI Phường Tây Thạnh. Ông/bà cần hướng dẫn về thủ tục hành chính nào (Khai sinh, kết hôn, chứng thực...) không ạ?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Map ChatMessage to Message type expected by geminiService.sendMessage
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const responseText = await geminiService.sendMessage(history, currentInput);
      
      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText || "Dạ, rất tiếc tôi chưa tìm thấy thông tin phù hợp cho yêu cầu này. Ông/bà vui lòng mô tả chi tiết hơn được không ạ?",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Gemini Assistant Error:", error);
      // User-friendly error message
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Dạ, thành thật xin lỗi ông/bà, hệ thống Trợ lý ảo đang gặp sự cố kết nối hoặc quá tải. Ông/bà vui lòng thử lại sau ít phút hoặc liên hệ trực tiếp UBND Phường Tây Thạnh tại số 200/12 Nguyễn Hữu Tiến để được hỗ trợ trực tiếp ạ.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold leading-none text-sm uppercase tracking-tight">Trợ lý ảo Smart 4.0</h2>
            <p className="text-[10px] opacity-80 mt-1 font-bold">Hỗ trợ pháp lý Phường Tây Thạnh 24/7</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Làm mới hội thoại"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-red-500 text-white' : 'bg-white border border-slate-100 text-red-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                {msg.text.split('\n').map((line, idx) => {
                   const cleanLine = line.replace(/[*#]/g, '').trim();
                   if (!cleanLine) return <div key={idx} className="h-2" />;
                   return <p key={idx} className="mb-1 last:mb-0">{cleanLine}</p>;
                })}
                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'} font-bold`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 text-red-600 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-duration:0.6s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Đang xử lý dữ liệu...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 max-w-2xl mx-auto bg-slate-100 rounded-2xl p-1.5 pr-2 focus-within:ring-2 focus-within:ring-red-400/20 focus-within:bg-white transition-all shadow-inner border border-slate-200/50">
          <div className="p-2 text-slate-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Dạ, ông/bà cần hỏi gì ạ?"
            className="flex-1 bg-transparent border-none focus:outline-none text-[14px] p-2 text-slate-700 font-bold placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" fill="currentColor" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2 italic font-bold">Lưu ý: Thông tin từ trợ lý ảo AI chỉ mang tính chất tham khảo hướng dẫn.</p>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </div>
  );
};

export default LegalChat;
