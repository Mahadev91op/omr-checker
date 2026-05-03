import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Exam from '@/models/Exam';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ success: false, error: 'Exam not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, exam }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();
    
    const updatedExam = await Exam.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedExam) {
      return NextResponse.json({ success: false, error: 'Exam not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, exam: updatedExam }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deletedExam = await Exam.findByIdAndDelete(id);
    
    if (!deletedExam) {
      return NextResponse.json({ success: false, error: 'Exam not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Exam deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
