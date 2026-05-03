import { LayoutDashboard, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
          <LayoutDashboard size={20} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">OMR Checker</h1>
          <p className="text-xs text-slate-500 font-medium">Dashboard</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
        <User size={18} />
      </div>
    </header>
  );
}