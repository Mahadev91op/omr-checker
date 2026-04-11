import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Exam from '@/models/Exam';

// Naya Exam aur Answer Key save karne ke liye POST request
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json(); // Frontend se data aayega

    const newExam = await Exam.create(data);

    return NextResponse.json({ success: true, exam: newExam }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Saare Exams dekhne ke liye GET request
export async function GET() {
  try {
    await connectToDatabase();
    const exams = await Exam.find({});
    return NextResponse.json({ success: true, exams }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}