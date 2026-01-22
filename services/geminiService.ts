import { ChatMessage } from '../types';

// Lấy API key từ biến môi trường
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
}

export const sendMessageToGemini = async (
  userInput: string,
  history: ChatMessage[] = []
): Promise<string> => {
  if (!API_KEY) {
    throw new Error('API key chưa được cấu hình. Vui lòng thêm VITE_GROQ_API_KEY vào environment variables trên Vercel.');
  }

  try {
    const systemPrompt = `Bạn là trợ lý ảo thông minh của Trung tâm Phục vụ Hành chính công Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

Nhiệm vụ:
- Hỗ trợ người dân tra cứu thủ tục hành chính
- Hướng dẫn cách nộp hồ sơ online/offline
- Giải đáp thắc mắc về giấy tờ cần thiết
- Thông tin thời gian xử lý và lệ phí
- Luôn lịch sự, chuyên nghiệp và nhiệt tình

Phong cách giao tiếp:
- Ngắn gọn, rõ ràng, dễ hiểu
- Sử dụng bullet points khi liệt kê
- Thân thiện nhưng chuyên nghiệp
- Luôn kết thúc bằng câu hỏi hỗ trợ thêm`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: userInput }
    ];

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const data: GeminiResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error('Không nhận được phản hồi hợp lệ từ AI');
    
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw error;
      }
      throw new Error(`Xin lỗi, đã có lỗi xảy ra: ${error.message}`);
    }
    
    throw new Error('Xin lỗi, hệ thống tạm thời không phản hồi. Vui lòng thử lại sau.');
  }
};

// Export service object để dễ sử dụng
export const geminiService = {
  sendMessage: async (history: ChatMessage[], userInput: string): Promise<string> => {
    return sendMessageToGemini(userInput, history);
  }
};
