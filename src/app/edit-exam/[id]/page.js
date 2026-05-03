"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditExam() {
  const router = useRouter();
  const { id } = useParams();
  
  const [examName, setExamName] = useState("");
  const [className, setClassName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [answerKey, setAnswerKey] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchExamDetails();
    }
  }, [id]);

  const fetchExamDetails = async () => {
    try {
      const res = await fetch(`/api/exams/${id}`);
      const data = await res.json();
      if (data.success) {
        setExamName(data.exam.examName);
        setClassName(data.exam.className);
        setTotalQuestions(data.exam.answerKey.length);
        
        // Convert array answerKey back to object for UI
        const keyObj = {};
        data.exam.answerKey.forEach(item => {
          keyObj[item.questionNumber] = item.correctOption;
        });
        setAnswerKey(keyObj);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load exam details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qNumber, value) => {
    setAnswerKey(prev => ({
      ...prev,
      [qNumber]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedAnswerKey = [];
    for (let i = 1; i <= totalQuestions; i++) {
      if (!answerKey[i]) {
        alert(`Please select an answer for Question ${i}!`);
        setIsSubmitting(false);
        return;
      }
      formattedAnswerKey.push({ questionNumber: i, correctOption: answerKey[i] });
    }

    const payload = {
      examName,
      className,
      answerKey: formattedAnswerKey
    };

    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Exam updated successfully!");
        router.push('/manage-exams');
      } else {
        alert("Failed to update exam.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50 flex justify-center">
      <div className="w-full max-w-3xl premium-card p-8 relative z-10">
        
        <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
          <button onClick={() => router.push('/manage-exams')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Edit Answer Key</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Exam Name</label>
              <input type="text" required value={examName} onChange={(e) => setExamName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900" />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
              <input type="text" required value={className} onChange={(e) => setClassName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900" />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Questions</label>
            <input type="number" min="1" max="100" value={totalQuestions} onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full md:w-1/3 bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900" />
          </div>

          <div className="mt-8 bg-slate-50/50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Update Correct Answers:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => (
                <div key={qNum} className="flex flex-col items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-all">
                  <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Question {qNum}</span>
                  <select 
                    value={answerKey[qNum] || ""} 
                    onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-center font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="" disabled>-</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 mt-6 flex justify-end items-center gap-4">
            <button type="button" onClick={() => router.push('/manage-exams')} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
              {isSubmitting ? "Updating..." : "Update Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
