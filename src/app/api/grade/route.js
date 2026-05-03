import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const data = await request.json();
    const { imageBase64, answerKey } = data;

    if (!imageBase64 || !answerKey) {
      return NextResponse.json({ success: false, error: "Missing image or answer key" }, { status: 400 });
    }

    const totalQuestions = answerKey.length;

    // Convert base64 string to required format (remove data:image/jpeg;base64, prefix if present)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Analyze this OMR sheet image carefully.
There are a total of ${totalQuestions} questions marked on this sheet.
Find the selected option for each question from 1 to ${totalQuestions}. The possible options are usually A, B, C, D.
If a question is left blank, or if multiple bubbles are filled for a single question, mark its answer as null.
Return ONLY a valid JSON object where the keys are the question numbers (as strings "1", "2", etc.) and the values are the detected options (e.g., "A", "B", "C", "D", or null).
Example format:
{
  "1": "A",
  "2": "C",
  "3": null
}
Do not return any markdown formatting like \`\`\`json, just the raw JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.1, // Low temperature for consistent classification
        responseMimeType: "application/json"
      }
    });

    const aiResponseText = response.text.trim();
    console.log("Raw AI Response:", aiResponseText);
    
    let aiAnswers;
    try {
      aiAnswers = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("JSON Parse Error on AI Response:", aiResponseText);
      return NextResponse.json({ success: false, error: "AI returned invalid format. Please try again." }, { status: 500 });
    }

    // Grading logic
    let score = 0;
    const responses = answerKey.map((keyItem) => {
      const qNum = keyItem.questionNumber.toString();
      const markedOption = aiAnswers[qNum] || null;
      const isCorrect = markedOption === keyItem.correctOption;
      
      if (isCorrect) {
        score++;
      }

      return {
        questionNumber: keyItem.questionNumber,
        correctOption: keyItem.correctOption,
        markedOption: markedOption,
        isCorrect: isCorrect
      };
    });

    const percentage = ((score / totalQuestions) * 100).toFixed(1);

    return NextResponse.json({
      success: true,
      result: {
        score,
        totalQuestions,
        percentage,
        responses
      }
    });

  } catch (error) {
    console.error("AI Grading Error:", error);
    return NextResponse.json({ success: false, error: error.message || error.toString() }, { status: 500 });
  }
}
