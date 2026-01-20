
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, FileText, Check } from 'lucide-react';

const Appointment: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Nguyễn Văn Dân',
    phone: '0901234567',
    procedure: 'Đăng ký khai sinh',
    date: '',
    time: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký hẹn thành công!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Mã số cuộc hẹn: <span className="font-bold text-slate-800">HEN-9923</span>. <br/>
          Vui lòng đến đúng giờ tại Quầy 01 - Bộ phận Một cửa.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
        >
          Trở lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Đặt lịch hẹn làm việc</h2>
        <p className="text-slate-500 mt-2">Tiết kiệm thời gian chờ đợi bằng cách đặt lịch trước với cán bộ chuyên trách.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Họ và tên
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Số điện thoại
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Thủ tục cần làm
          </label>
          <select 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={formData.procedure}
            onChange={e => setFormData({...formData, procedure: e.target.value})}
          >
            <option>Đăng ký khai sinh</option>
            <option>Chứng thực bản sao</option>
            <option>Xác nhận tình trạng hôn nhân</option>
            <option>Thủ tục đất đai</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5" /> Ngày hẹn
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Giờ hẹn
            </label>
            <select 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            >
              <option value="">Chọn giờ</option>
              <option>08:00 - 09:00</option>
              <option>09:00 - 10:00</option>
              <option>10:00 - 11:00</option>
              <option>13:30 - 14:30</option>
              <option>14:30 - 15:30</option>
              <option>15:30 - 16:30</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-4 active:scale-[0.98]"
        >
          XÁC NHẬN ĐẶT LỊCH
        </button>
      </form>
    </div>
  );
};

export default Appointment;
