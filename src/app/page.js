import connectToDatabase from '@/lib/mongodb';
import Exam from '@/models/Exam';
import Result from '@/models/Result';

import Header from '@/components/Header';
import QuickActions from '@/components/QuickActions';
import RecentExams from '@/components/RecentExams';
import RecentResults from '@/components/RecentResults';
import BottomNav from '@/components/BottomNav';

export const dynamic = 'force-dynamic'; 

export default async function Home() {
  let safeExams = [];
  let safeResults = [];

  try {
    // 1. Database se judna
    await connectToDatabase();
    
    // 2. Data lana
    const rawExams = await Exam.find({}).sort({ createdAt: -1 }).limit(15).lean();
    const rawResults = await Result.find({}).sort({ createdAt: -1 }).limit(15).lean();

    // ERROR FIX: Next.js ko plain object chahiye. 
    safeExams = rawExams.map((exam) => ({
      ...exam,
      _id: exam._id.toString(),
      date: exam.date ? new Date(exam.date).toISOString() : null,
      createdAt: exam.createdAt ? new Date(exam.createdAt).toISOString() : null,
      updatedAt: exam.updatedAt ? new Date(exam.updatedAt).toISOString() : null,
      answerKey: exam.answerKey ? exam.answerKey.map(k => ({
        questionNumber: k.questionNumber,
        correctOption: k.correctOption,
        _id: k._id ? k._id.toString() : null
      })) : []
    }));

    safeResults = rawResults.map((res) => ({
      ...res,
      _id: res._id.toString(),
      examId: res.examId.toString(),
      createdAt: res.createdAt ? new Date(res.createdAt).toISOString() : null,
      updatedAt: res.updatedAt ? new Date(res.updatedAt).toISOString() : null,
      responses: res.responses ? res.responses.map(r => ({
        ...r,
        _id: r._id ? r._id.toString() : null
      })) : []
    }));

  } catch (error) {
    console.error("Home page data load hone me error aayi:", error.message);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex justify-center pb-24">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm border-x border-slate-100 flex flex-col">
        
        <Header />

        <main className="flex-1 px-5 py-6 overflow-y-auto hide-scrollbar">
          <QuickActions />
          <RecentResults results={safeResults} />
          <div className="mt-8"></div>
          <RecentExams exams={safeExams} />
        </main>

        <BottomNav />

      </div>
    </div>
  );
}