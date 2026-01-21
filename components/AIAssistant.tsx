import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ArrowLeft, Send, Mic, MicOff, Bot, Loader2, AlertCircle } from 'lucide-react';

interface AIAssistantProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Xin chào! Tôi là trợ lý ảo AI của UBND Phường Tây Thạnh. Tôi có thể giúp bạn:\n\n• Tra cứu thủ tục hành chính\n• Hướng dẫn nộp hồ sơ\n• Kiểm tra trạng thái hồ sơ\n• Đặt lịch hẹn\n• Giải đáp thắc mắc về dịch vụ công\n\nBạn cần hỗ trợ gì hôm nay?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khởi tạo Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Không thể nhận diện giọng nói. Vui lòng thử lại.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Trình duyệt không hỗ trợ nhận diện giọng nói');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Kiểm tra API key
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        systemInstruction: `Bạn là trợ lý ảo AI thông minh của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM. 

Nhiệm vụ của bạn:
- Hỗ trợ người dân về thủ tục hành chính công
- Hướng dẫn tra cứu, nộp hồ sơ trực tuyến
- Giải đáp thắc mắc về dịch vụ công
- Hướng dẫn đặt lịch hẹn
- Cung cấp thông tin về chính sách, quy định

Phong cách giao tiếp:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời ngắn gọn, dễ hiểu
- Sử dụng tiếng Việt có dấu
- Đưa ra hướng dẫn cụ thể, từng bước

Lưu ý:
- Nếu không chắc chắn, hãy khuyên người dân liên hệ trực tiếp
- Luôn cung cấp thông tin chính xác về địa chỉ, giờ làm việc
- Ưu tiên giải pháp trực tuyến, số hóa`
      });

      // Tạo lịch sử chat cho context
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({
        history: chatHistory
      });

      const result = await chat.sendMessage(userMessage.text);
      const response = await result.response;
      const responseText = response.text();

      const aiMessage: Message = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('AI Error:', err);
      
      let errorMessage = 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.';
      
      if (err.message === 'API_KEY_MISSING') {
        errorMessage = 'Lỗi cấu hình: Thiếu API key. Vui lòng liên hệ quản trị viên.';
      } else if (err.message?.includes('quota')) {
        errorMessage = 'Hệ thống đã hết quota API. Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.';
      } else if (err.message?.includes('API key')) {
        errorMessage = 'API key không hợp lệ. Vui lòng kiểm tra lại cấu hình.';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
      }

      setError(errorMessage);
      
      const errorAIMessage: Message = {
        role: 'model',
        text: `⚠️ ${errorMessage}\n\nBạn có thể:\n• Thử lại sau vài phút\n• Liên hệ trực tiếp: (028) 1234 5678\n• Gửi email: taythanh@tpu.hochiminhcity.gov.vn\n• Đến trực tiếp: 123 Đường ABC, Phường Tây Thạnh`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorAIMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="font-bold text-base">Trợ lý AI</h2>
                <p className="text-xs text-white/80">Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm p-4 flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-red-600" />
              <span className="text-sm text-slate-600">Đang suy nghĩ...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 max-w-[90%]">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
        <div className="flex items-end gap-2">
          <button
            onClick={toggleListening}
            className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            disabled={isLoading}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 resize-none rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-red-600 min-h-[48px] max-h-[120px]"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? 'bg-red-600 text-white hover:bg-red-700 active:scale-90'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
