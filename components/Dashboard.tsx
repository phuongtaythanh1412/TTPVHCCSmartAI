
import React from 'react';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  FileCheck,
  ArrowRight,
  Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Khai sinh', val: 45 },
  { name: 'Chứng thực', val: 120 },
  { name: 'Đất đai', val: 25 },
  { name: 'Hộ tịch', val: 68 },
  { name: 'Khác', val: 32 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Xin chào, Nguyễn Văn Dân</h2>
          <p className="text-slate-500">Chào mừng bạn quay lại Cổng thông tin Hành chính công.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
          <Bell className="w-4 h-4 text-slate-400" />
          Thông báo mới (3)
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hồ sơ đang xử lý', value: '12', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Hồ sơ hoàn tất', value: '158', icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Lượt dân tiếp nhận', value: '1,240', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Tỷ lệ hài lòng', value: '98%', icon: ClipboardCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Thống kê hồ sơ theo lĩnh vực</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Dịch vụ phổ biến</h3>
          <div className="space-y-3">
            {[
              'Đăng ký khai sinh trực tuyến',
              'Chứng thực bản sao điện tử',
              'Đăng ký thường trú',
              'Xác nhận tình trạng hôn nhân'
            ].map((link, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <span className="text-sm text-slate-700 font-medium">{link}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-600 rounded-xl text-white">
            <p className="text-sm font-medium mb-1">Cần hỗ trợ?</p>
            <p className="text-xs opacity-80 mb-3">Sử dụng Trợ lý ảo AI để được hướng dẫn chuẩn bị hồ sơ nhanh chóng.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all">THỬ NGAY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
