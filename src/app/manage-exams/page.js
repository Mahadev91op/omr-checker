"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Edit, FileText, Loader2 } from 'lucide-react';

export default function ManageExams() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/exams');
      const data = await res.json();
      if (data.success) {
        setExams(data.exams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    
    try {
      const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExams(exams.filter(exam => exam._id !== id));
      } else {
        alert("Failed to delete exam.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting exam.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50 flex justify-center">
      <div className="w-full max-w-3xl premium-card p-6 relative z-10 flex flex-col min-h-[80vh]">
        
        <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-4">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Manage Exams</h1>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : exams.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileText size={48} className="mb-4 text-slate-300" />
            <p>No exams found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map(exam => (
              <div key={exam._id} className="border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-blue-200 transition-colors">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{exam.examName}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    Class: <span className="font-semibold text-slate-700">{exam.className}</span> • Questions: {exam.answerKey.length}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => router.push(`/edit-exam/${exam._id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Exam"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(exam._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
