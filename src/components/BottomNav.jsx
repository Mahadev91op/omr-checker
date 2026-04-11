import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="fixed md:absolute bottom-0 w-full max-w-md bg-white border-t border-slate-100 flex justify-around py-3 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
      <Link href="/" className="flex flex-col items-center gap-1 text-blue-600">
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      <Link href="/scanner" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800">
        <span className="text-xl">📷</span>
        <span className="text-[10px] font-medium">Scan</span>
      </Link>
      <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800">
        <span className="text-xl">⚙️</span>
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </nav>
  );
}