import { Message } from '../types';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt cho AI Assistant của UBND Phường Tây Thạnh
const SYSTEM_PROMPT = `Bạn là Trợ lý ảo AI thông minh của UBND Phường Tây Thạnh, TP.HCM.

NHIỆM VỤ CHÍNH: Hướng dẫn thủ tục hành chính ngắn gọn nhưng đầy đủ từng bước, tập trung vào nộp trực tuyến.

PHONG CÁCH PHẢN HỒI:
- Ngôn ngữ: Dạ, thưa ông/bà (Lịch sự, chuyên nghiệp).
- Cấu trúc: Chia rõ các bước 1, 2, 3.

QUY TẮC NỘI DUNG (BẮT BUỘC):

1. HƯỚNG DẪN CHI TIẾT THEO CẤU TRÚC:
   - 📄 **Hồ sơ cần có**: Liệt kê các giấy tờ cần quét/chụp (Scan).
   - 💻 **Nộp trực tuyến**: 
     + Bước 1: Truy cập Cổng DVC Quốc gia (dichvucong.gov.vn) hoặc TP.HCM (dichvucong.hochiminhcity.gov.vn).
     + Bước 2: Đăng nhập bằng định danh điện tử VNeID.
     + Bước 3: Tìm tên thủ tục, tải file hồ sơ và ký số/xác nhận.
   - ⚡ **Tốc độ**: Nêu thời gian xử lý (Ví dụ: 1-3 ngày làm việc).
   - 🛡️ **Bảo mật**: Cam kết dữ liệu cá nhân được mã hóa và bảo vệ đúng luật.

2. QUY TẮC "ẨN" BỘ MÁY:
   - Không nhắc đến lãnh đạo hay Phó Giám đốc Trung tâm trừ khi bị hỏi đích danh.
   - Nếu bị hỏi: Trả lời ngắn gọn rằng đây là chức danh giúp đôn đốc hồ sơ ⚡ NHANH và 🛡️ AN TOÀN.

3. GIỚI HẠN:
   - Địa chỉ: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh.
   - TUYỆT ĐỐI KHÔNG dùng từ "Quận Tân Phú".

MỤC TIÊU: Giúp người dân tự nộp hồ sơ trực tuyến thành công ngay lần đầu.`;

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
