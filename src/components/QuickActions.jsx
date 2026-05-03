import Link from 'next/link';
import { PlusCircle, Camera } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Link href="/create-exam" className="block group">
        <div className="premium-card p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md hover:border-blue-200">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <PlusCircle size={24} className="stroke-[2]" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">New Exam</h2>
          <p className="text-[10px] font-medium text-slate-500 mt-1">Create Answer Key</p>
        </div>
      </Link>
      <Link href="/scanner" className="block group">
        <div className="premium-card p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md hover:border-emerald-200">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Camera size={24} className="stroke-[2]" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Scan Paper</h2>
          <p className="text-[10px] font-medium text-slate-500 mt-1">Start Camera</p>
        </div>
      </Link>
    </div>
  );
}