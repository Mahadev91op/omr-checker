import Link from 'next/link';
import { Home, ScanLine, Settings } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed md:absolute bottom-0 w-full max-w-md bg-white border-t border-slate-200 flex justify-around py-3 px-2 shadow-sm z-50">
      <Link href="/" className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
        <Home size={22} className="stroke-[2]" />
        <span className="text-[10px] font-semibold">Home</span>
      </Link>
      <Link href="/scanner" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors">
        <ScanLine size={22} className="stroke-[2]" />
        <span className="text-[10px] font-semibold">Scan</span>
      </Link>
      <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors">
        <Settings size={22} className="stroke-[2]" />
        <span className="text-[10px] font-semibold">Settings</span>
      </button>
    </nav>
  );
}