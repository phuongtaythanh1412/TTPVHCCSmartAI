
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { getGeminiChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const LegalChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Xin chào! Tôi là Trợ lý ảo Hành chính công. Bạn cần tôi hướng dẫn về thủ tục nào (Khai sinh, kết hôn, chứng thực,...) không?',
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
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getGeminiChatResponse(input, history);
    
    setMessages(prev => [...prev, {
      role: 'model',
      text: responseText || "Rất tiếc, đã có lỗi xảy ra.",
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold leading-none">Trợ lý ảo AI</h2>
            <p className="text-[10px] opacity-80 mt-1">Hỗ trợ pháp lý & thủ tục hành chính 24/7</p>
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white shadow-sm border border-slate-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 text-indigo-600 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-100 flex items-center gap-2">
                <span className="text-sm text-slate-400">Đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 max-w-2xl mx-auto bg-slate-100 rounded-xl p-1.5 pr-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition-all shadow-inner">
          <div className="p-2 text-slate-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi về thủ tục khai sinh, chứng thực..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm p-2 text-slate-700"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2 italic">Lưu ý: Thông tin từ trợ lý ảo chỉ mang tính chất tham khảo chuẩn bị hồ sơ.</p>
      </div>
    </div>
  );
};

export default LegalChat;
