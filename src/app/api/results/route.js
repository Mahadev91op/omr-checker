import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Result from '@/models/Result';

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Calculate percentage if not provided
    if (data.percentage === undefined && data.totalQuestions > 0) {
      data.percentage = (data.score / data.totalQuestions) * 100;
    }

    const newResult = await Result.create(data);
    return NextResponse.json({ success: true, result: newResult }, { status: 201 });
  } catch (error) {
    console.error("Result POST Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const results = await Result.find({}).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error("Result GET Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
