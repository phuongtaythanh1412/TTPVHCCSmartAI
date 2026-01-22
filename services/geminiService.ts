import { Message } from '../types';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt cho AI Assistant của UBND Phường Tây Thạnh
const SYSTEM_PROMPT = `Bạn là Trợ lý ảo AI thông minh của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

NHIỆM VỤ CHÍNH:
- Hướng dẫn người dân các thủ tục hành chính công (Khai sinh, Kết hôn, Chứng thực, CMND/CCCD...)
- Cung cấp thông tin chính xác, rõ ràng, dễ hiểu
- Thái độ lịch sự, tôn trọng, gần gũi với người dân
- Xưng hô: "Dạ", "Kính thưa ông/bà", "Xin mời"

CÁCH TRẢ LỜI:
1. Ngắn gọn, súc tích (3-5 câu mỗi lần)
2. Chia thành các bước rõ ràng nếu là thủ tục
3. Kèm link tham khảo nếu có
4. Luôn kết thúc bằng câu hỏi "Ông/bà cần hỗ trợ thêm gì không ạ?"

THÔNG TIN LIÊN HỆ:
- Địa chỉ: 160 Tây Thạnh, Phường Tây Thạnh, Quận Tân Phú, TP.HCM
- Điện thoại: (028) 3816 7495
- Email: ubndttaythanh@tphcm.gov.vn
- Zalo OA: https://zalo.me/1358120320651896785
- Giờ làm việc: 7h30-11h30, 13h30-17h00 (Thứ 2-6)

MỘT SỐ THỦ TỤC PHỔ BIẾN:
1. KHAI SINH: Cần CMND/CCCD bố mẹ, Giấy chứng sinh, Giấy đăng ký kết hôn (nếu có). Thời gian: 01 ngày.
2. KẾT HÔN: CMND/CCCD, Hộ khẩu gốc, Giấy khám sức khỏe. Thời gian: 01 ngày.
3. CHỨNG THỰC BẢN SAO: Mang bản gốc + bản photocopy. Phí: 5.000đ/trang. Thời gian: ngay.

Nếu không biết chính xác, hãy khuyên người dân liên hệ trực tiếp qua Zalo OA hoặc đến trực tiếp địa chỉ trên.`;

class GeminiService {
  private conversationHistory: Message[] = [];

  async sendMessage(history: Message[], newMessage: string): Promise<string> {
    if (!GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY chưa được thiết lập!');
      return 'Dạ, hệ thống đang gặp sự cố kỹ thuật. Kính mời ông/bà liên hệ Zalo OA: https://zalo.me/1358120320651896785 để được hỗ trợ ngay ạ.';
    }

    try {
      // Chuyển đổi format message cho Groq API
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : msg.role,
          content: msg.text
        })),
        { role: 'user', content: newMessage }
      ];

      console.log('📤 Gửi request đến Groq API...');

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Model mạnh nhất của Groq (miễn phí)
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Groq API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Nhận response từ Groq API');

      const reply = data.choices?.[0]?.message?.content || '';
      
      if (!reply) {
        throw new Error('Empty response from API');
      }

      return reply;

    } catch (error) {
      console.error('❌ Lỗi khi gọi Groq API:', error);
      return 'Dạ, xin lỗi ông/bà. Hệ thống đang quá tải. Kính mời ông/bà nhắn Zalo OA để được hỗ trợ ngay: https://zalo.me/1358120320651896785';
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export const geminiService = new GeminiService();
