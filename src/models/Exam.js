import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  className: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // Answer key ek array hogi jisme question number aur uska sahi option hoga
  answerKey: [{
    questionNumber: { type: Number, required: true },
    correctOption: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] }
  }]
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);