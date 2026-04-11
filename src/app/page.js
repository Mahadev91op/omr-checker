import connectToDatabase from '@/lib/mongodb';
import Exam from '@/models/Exam';

import Header from '@/components/Header';
import QuickActions from '@/components/QuickActions';
import RecentExams from '@/components/RecentExams';
import BottomNav from '@/components/BottomNav';

export const dynamic = 'force-dynamic'; 

export default async function Home() {
  let safeExams = [];

  try {
    // 1. Database se judna
    await connectToDatabase();
    
    // 2. Data lana
    const rawExams = await Exam.find({}).sort({ createdAt: -1 }).limit(15).lean();

    // ERROR 1 FIX: Next.js ko plain object chahiye. 
    // Hum MongoDB ke _id aur Date ko string me convert kar rahe hain.
    safeExams = rawExams.map((exam) => ({
      ...exam,
      _id: exam._id.toString(), // _id Object se String ban gaya
      date: exam.date ? new Date(exam.date).toISOString() : null,
      createdAt: exam.createdAt ? new Date(exam.createdAt).toISOString() : null,
      updatedAt: exam.updatedAt ? new Date(exam.updatedAt).toISOString() : null,
      answerKey: exam.answerKey ? exam.answerKey.map(k => ({
        questionNumber: k.questionNumber,
        correctOption: k.correctOption,
        _id: k._id ? k._id.toString() : null
      })) : []
    }));

  } catch (error) {
    console.error("Home page data load hone me error aayi:", error.message);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex justify-center pb-20">
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm relative">
        
        <Header />

        <main className="px-5 py-6">
          <QuickActions />
          {/* Ab hum plain data bhej rahe hain, toh error nahi aayega */}
          <RecentExams exams={safeExams} />
        </main>

        <BottomNav />

      </div>
    </div>
  );
}