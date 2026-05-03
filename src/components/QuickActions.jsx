import Link from 'next/link';
import { PlusCircle, Camera, Settings2 } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <Link href="/create-exam" className="block group">
        <div className="premium-card p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md hover:border-blue-200 h-full">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <PlusCircle size={20} className="stroke-[2]" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">New Exam</h2>
        </div>
      </Link>
      <Link href="/scanner" className="block group">
        <div className="premium-card p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md hover:border-emerald-200 h-full">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Camera size={20} className="stroke-[2]" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">Scan Paper</h2>
        </div>
      </Link>
      <Link href="/manage-exams" className="block group">
        <div className="premium-card p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md hover:border-violet-200 h-full">
          <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mb-2 group-hover:bg-violet-600 group-hover:text-white transition-colors">
            <Settings2 size={20} className="stroke-[2]" />
          </div>
          <h2 className="text-xs font-bold text-slate-800">Manage</h2>
        </div>
      </Link>
    </div>
  );
}