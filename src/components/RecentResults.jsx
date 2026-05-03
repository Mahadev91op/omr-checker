import { CheckCircle2 } from 'lucide-react';

export default function RecentResults({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-bold text-slate-800">Recent Scans</h2>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
          {results.length} Scanned
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <div key={result._id.toString()} className="premium-card p-4 hover:border-emerald-200 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 truncate w-32 md:w-48">{result.examName}</h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-medium">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Student: {result.studentName}</span>
                  <span className="text-slate-300">•</span>
                  <span>{new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-lg font-bold ${result.percentage >= 50 ? 'text-emerald-600' : 'text-red-500'}`}>
                {result.percentage.toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{result.score}/{result.totalQuestions}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
