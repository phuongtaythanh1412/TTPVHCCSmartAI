
import React, { useState } from 'react';
import { Search, Loader2, CheckCircle, Clock, AlertCircle, FileText, Calendar, Info } from 'lucide-react';
import { DocumentStatus } from '../types';

const MOCK_STATUSES: DocumentStatus[] = [
  { id: 'HS-2023-001', citizenName: 'Nguyễn Văn Dân', procedureName: 'Đăng ký khai sinh', status: 'COMPLETED', submittedDate: '2023-11-20', updatedDate: '2023-11-21' },
  { id: 'HS-2023-042', citizenName: 'Nguyễn Văn Dân', procedureName: 'Chứng thực bản sao', status: 'PROCESSING', submittedDate: '2023-11-24', updatedDate: '2023-11-24' },
];

const StatusTracker: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<DocumentStatus | null>(null);

  const handleSearch = () => {
    if (!searchId) return;
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const found = MOCK_STATUSES.find(s => s.id.toLowerCase() === searchId.toLowerCase());
      setResult(found || null);
      setIsSearching(false);
    }, 800);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { label: 'Đã hoàn tất', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'PROCESSING': return { label: 'Đang xử lý', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'PENDING': return { label: 'Chờ tiếp nhận', icon: Loader2, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'REJECTED': return { label: 'Bị từ chối', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' };
      default: return { label: 'Không xác định', icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Tra cứu tình trạng hồ sơ</h2>
        <p className="text-slate-500 mt-2">Nhập mã số hồ sơ được cấp tại bộ phận một cửa để xem tiến độ.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Ví dụ: HS-2023-001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchId}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tra cứu'}
          </button>
        </div>
      </div>

      {result ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700">{result.id}</span>
            </div>
            {(() => {
              const status = getStatusDisplay(result.status);
              return (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                  <status.icon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{status.label}</span>
                </div>
              );
            })()}
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Người nộp hồ sơ</p>
                <p className="font-semibold text-slate-800">{result.citizenName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tên thủ tục</p>
                <p className="font-semibold text-slate-800">{result.procedureName}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ngày tiếp nhận</p>
                  <p className="text-sm font-medium text-slate-700">{result.submittedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Cập nhật cuối</p>
                  <p className="text-sm font-medium text-slate-700">{result.updatedDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] text-slate-400 italic">Mã số hồ sơ này có giá trị pháp lý trong việc đối chiếu tại UBND.</p>
            <button className="text-xs font-bold text-blue-600 hover:underline">Tải phiếu hẹn (PDF)</button>
          </div>
        </div>
      ) : searchId && !isSearching && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Không tìm thấy mã hồ sơ: <span className="text-slate-800">{searchId}</span></p>
          <p className="text-xs text-slate-400 mt-1 px-4">Vui lòng kiểm tra lại mã số trên phiếu hẹn hoặc liên hệ bộ phận một cửa.</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          {/* Added missing Info icon import */}
          <Info className="w-4 h-4" />
          Hướng dẫn tra cứu
        </h4>
        <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside opacity-90">
          <li>Mã hồ sơ bao gồm 10 ký tự in trên phiếu hẹn.</li>
          <li>Thông tin được cập nhật sau mỗi 24 giờ làm việc.</li>
          <li>Nếu hồ sơ quá hạn xử lý, vui lòng liên hệ hotline: 1900 xxxx.</li>
        </ul>
      </div>
    </div>
  );
};

export default StatusTracker;
