
import React, { useState } from 'react';
import { Search, ChevronRight, Info, BookOpen, MapPin, Scale } from 'lucide-react';
import { Procedure } from '../types';

const MOCK_PROCEDURES: Procedure[] = [
  { id: '1', title: 'Đăng ký khai sinh', category: 'Hộ tịch', description: 'Đăng ký khai sinh cho trẻ em sinh ra tại địa phương.', estimatedDays: 1, cost: 'Miễn phí' },
  { id: '2', title: 'Đăng ký kết hôn', category: 'Hộ tịch', description: 'Đăng ký kết hôn cho công dân Việt Nam cư trú trong nước.', estimatedDays: 1, cost: 'Miễn phí' },
  { id: '3', title: 'Chứng thực bản sao từ bản chính', category: 'Chứng thực', description: 'Chứng thực các loại giấy tờ, văn bằng từ bản gốc.', estimatedDays: 0, cost: '2,000đ/trang' },
  { id: '4', title: 'Cấp giấy xác nhận tình trạng hôn nhân', category: 'Hộ tịch', description: 'Cấp giấy xác nhận độc thân để sử dụng vào các mục đích pháp lý.', estimatedDays: 3, cost: 'Miễn phí' },
  { id: '5', title: 'Khai báo tạm trú', category: 'Cư trú', description: 'Thông báo lưu trú đối với người từ nơi khác đến.', estimatedDays: 0, cost: 'Miễn phí' },
  { id: '6', title: 'Hỗ trợ mai táng phí', category: 'Bảo trợ xã hội', description: 'Thủ tục dành cho người có công hoặc đối tượng chính sách.', estimatedDays: 7, cost: 'Miễn phí' },
];

const ProcedureList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = ['Tất cả', ...Array.from(new Set(MOCK_PROCEDURES.map(p => p.category)))];

  const filtered = MOCK_PROCEDURES.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Thủ tục hành chính</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thủ tục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(proc => (
          <div key={proc.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">{proc.category}</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <BookOpen className="w-3 h-3" />
                Dịch vụ công mức 3
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{proc.title}</h3>
            <p className="text-xs text-slate-500 mb-6 flex-1 line-clamp-2">{proc.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-1">Thời gian</p>
                <p className="text-sm font-semibold text-slate-700">{proc.estimatedDays === 0 ? 'Trong ngày' : `${proc.estimatedDays} ngày làm việc`}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-1">Lệ phí</p>
                <p className="text-sm font-semibold text-emerald-600">{proc.cost}</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-bold text-slate-600 transition-all">
              Chi tiết hồ sơ
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
            <Info className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Không tìm thấy thủ tục nào phù hợp.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory('Tất cả');}}
            className="text-blue-600 text-sm font-bold mt-2 hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Quick Access Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 flex gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 mb-1">Nơi nộp hồ sơ</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Bộ phận Tiếp nhận và Trả kết quả (Một cửa) tại UBND Xã/Thị trấn sở tại.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 flex gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 mb-1">Cơ sở pháp lý</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Thực hiện theo quy định của Luật Hộ tịch, Luật Đất đai và các Nghị định liên quan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureList;
