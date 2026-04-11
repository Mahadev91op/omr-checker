import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Exam from '@/models/Exam';

export async function POST(request) {
  console.log("\n========================================");
  console.log("📥 [API START] POST /api/exams route hit hua!");
  
  try {
    console.log("⏳ [API STEP 1] Database se connect hone ka wait kar rahe hain...");
    await connectToDatabase();
    console.log("✅ [API STEP 1 DONE] Database API me connect ho gaya.");

    const data = await request.json();
    console.log("📦 [API STEP 2] Frontend se yeh data aaya:", data);
    
    console.log("⏳ [API STEP 3] Database me Exam save karne ki koshish...");
    const newExam = await Exam.create(data);
    
    console.log("🎉 [API SUCCESS] Exam successfully save ho gaya! ID:", newExam._id);
    console.log("========================================\n");
    
    return NextResponse.json({ success: true, exam: newExam }, { status: 201 });
    
  } catch (error) {
    console.error("\n🚨 [API FATAL ERROR] POST Route me error aayi:");
    console.error(error.message);
    console.log("========================================\n");
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Saare Exams dekhne ke liye GET request
export async function GET() {
  console.log("\n========================================");
  console.log("📤 [API START] GET /api/exams hit hua (Home page load hone par)");
  try {
    await connectToDatabase();
    const exams = await Exam.find({}).sort({ createdAt: -1 });
    console.log(`✅ [API SUCCESS] Total ${exams.length} exams database se nikale gaye.`);
    console.log("========================================\n");
    return NextResponse.json({ success: true, exams }, { status: 200 });
  } catch (error) {
    console.error("🚨 [API ERROR] GET request me error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}