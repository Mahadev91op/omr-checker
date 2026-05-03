import { FileText, ChevronRight, Inbox } from 'lucide-react';

export default function RecentExams({ exams }) {
  return (
    <>
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-bold text-slate-800">Recent Exams</h2>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
          {exams.length} Total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {exams.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center">
            <Inbox size={40} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No exams found.<br/>Create a new exam first!</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam._id.toString()} className="premium-card p-4 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 truncate w-32 md:w-48">{exam.examName}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-medium">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{exam.className}</span>
                    <span className="text-slate-300">•</span>
                    <span>{new Date(exam.date || exam.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 group-hover:text-blue-600 p-2 rounded-xl transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}