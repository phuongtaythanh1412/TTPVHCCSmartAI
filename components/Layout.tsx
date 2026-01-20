
import React from 'react';
import { 
  Home, 
  FileText, 
  Search, 
  MessageSquare, 
  Calendar, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Trang chủ', icon: Home },
    { id: AppView.PROCEDURES, label: 'Thủ tục hành chính', icon: FileText },
    { id: AppView.TRACKING, label: 'Tra cứu hồ sơ', icon: Search },
    { id: AppView.CHATBOT, label: 'Trợ lý ảo AI', icon: MessageSquare },
    { id: AppView.APPOINTMENT, label: 'Đặt lịch hẹn', icon: Calendar },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">VH</div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 uppercase leading-tight">Cổng Hành Chính</h1>
              <p className="text-xs text-slate-500">Cấp Xã/Thị Trấn</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">Nguyễn Văn Dân</p>
                <p className="text-[10px] text-slate-500 truncate">Hộ khẩu thường trú</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <span className="font-bold text-slate-800 text-sm">UBND CẤP XÃ</span>
          <div className="w-6"></div>
        </header>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
