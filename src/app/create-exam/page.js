"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateExam() {
  const router = useRouter();
  const [examName, setExamName] = useState("");
  const [className, setClassName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(10); // Default 10 questions
  const [answerKey, setAnswerKey] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown se answer select karne ka function
  const handleAnswerChange = (qNumber, value) => {
    setAnswerKey(prev => ({
      ...prev,
      [qNumber]: value
    }));
  };

  // Form submit karke Database me save karne ka function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Data ko sahi format me convert karna (Array format for Database)
    const formattedAnswerKey = [];
    for (let i = 1; i <= totalQuestions; i++) {
      if (!answerKey[i]) {
        alert(`Kripya Question ${i} ka answer select karein!`);
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
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Exam aur Answer Key successfully save ho gayi!");
        router.push('/'); // Wapas dashboard par bhej do
      } else {
        alert("Kuch error aayi. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Nayi Answer Key Set Karein</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Exam Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exam Ka Naam (e.g., Math Half Yearly)</label>
              <input type="text" required value={examName} onChange={(e) => setExamName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Exam Name..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
              <input type="text" required value={className} onChange={(e) => setClassName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g., 10th A" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Questions (Kitne sawal hain?)</label>
            <input type="number" min="1" max="100" value={totalQuestions} onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full md:w-1/3 border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>

          {/* Answer Key Grid */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 bg-slate-100 p-2 rounded">Sahi Answers Chunein:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              
              {/* Loop lagakar questions generate karna */}
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => (
                <div key={qNum} className="flex flex-col items-center p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <span className="text-sm font-bold text-slate-600 mb-2">Q {qNum}</span>
                  <select 
                    value={answerKey[qNum] || ""} 
                    onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none text-center font-medium"
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

          {/* Submit Button */}
          <div className="pt-6 border-t mt-6 text-right">
            <button type="button" onClick={() => router.push('/')} className="px-6 py-3 text-slate-600 font-medium mr-4 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? "Save ho raha hai..." : "Save Answer Key"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}