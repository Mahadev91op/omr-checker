import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Link href="/create-exam" className="block">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl mb-3">📝</div>
          <h2 className="text-sm font-bold text-slate-700">Naya Exam</h2>
          <p className="text-[10px] text-slate-500 mt-1 leading-tight">Answer key banayein</p>
        </div>
      </Link>
      <Link href="/scanner" className="block">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl mb-3">📷</div>
          <h2 className="text-sm font-bold text-slate-700">Scan Paper</h2>
          <p className="text-[10px] text-slate-500 mt-1 leading-tight">Camera open karein</p>
        </div>
      </Link>
    </div>
  );
}