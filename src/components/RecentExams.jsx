export default function RecentExams({ exams }) {
  return (
    <>
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-bold text-slate-800">Recent Exams</h2>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
          {exams.length} Total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {exams.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-slate-500">Koi exam nahi mila.<br/>Pehle ek naya exam banayein!</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam._id.toString()} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-blue-200 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-lg">📄</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 truncate w-32 md:w-48">{exam.examName}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{exam.className}</span>
                    <span>•</span>
                    <span>{new Date(exam.date || exam.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-xl text-xs font-bold active:scale-90 transition-transform">
                View
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}