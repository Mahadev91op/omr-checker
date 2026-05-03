import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  examName: { type: String, required: true },
  studentName: { type: String, default: "Unknown Student" },
  rollNumber: { type: String, default: "N/A" },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  responses: [{
    questionNumber: { type: Number, required: true },
    markedOption: { type: String }, // User ne kya mark kiya
    correctOption: { type: String, required: true }, // Sahi answer kya tha
    isCorrect: { type: Boolean, required: true }
  }]
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
