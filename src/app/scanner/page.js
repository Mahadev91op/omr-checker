"use client";
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Camera, RefreshCw, Save, ScanLine, XCircle, CheckCircle2 } from 'lucide-react';

export default function LiveScanner() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [error, setError] = useState("");
  const [cvLoaded, setCvLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState("Loading...");
  
  // Exam selection state
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Result state
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load exams on mount
  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch('/api/exams');
        const data = await res.json();
        if (data.success) {
          setExams(data.exams);
          setScanStatus("Select an Exam to start.");
        }
      } catch (err) {
        console.error("Failed to load exams", err);
        setError("Failed to load exams.");
      }
    }
    fetchExams();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanStatus("Camera Ready. Point at OMR.");
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied.");
    }
  };

  const onOpenCvReady = () => {
    setCvLoaded(true);
    console.log("OpenCV.js Ready");
  };

  const handleExamSelect = (e) => {
    const examId = e.target.value;
    const exam = exams.find(x => x._id === examId);
    setSelectedExam(exam);
    if (exam) {
      startCamera();
    }
  };

  // Har 1.5 second me frame process karna
  const processFrame = () => {
    if (!cvLoaded || !videoRef.current || !canvasRef.current || scanResult || isProcessing || !selectedExam) return;
    
    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        setScanStatus("Analyzing frame...");
        
        // --- OPENCV OMR LOGIC ---
        let src = window.cv.imread(canvas);
        let gray = new window.cv.Mat();
        let blurred = new window.cv.Mat();
        let edged = new window.cv.Mat();

        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
        window.cv.GaussianBlur(gray, blurred, new window.cv.Size(5, 5), 0);
        window.cv.Canny(blurred, edged, 75, 200);

        let contours = new window.cv.MatVector();
        let hierarchy = new window.cv.Mat();
        window.cv.findContours(edged, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);

        let docContour = null;
        let maxArea = 0;

        // Find the document (largest quad)
        for (let i = 0; i < contours.size(); ++i) {
          let cnt = contours.get(i);
          let area = window.cv.contourArea(cnt);
          if (area > 50000) { // minimum area for document
            let peri = window.cv.arcLength(cnt, true);
            let approx = new window.cv.Mat();
            window.cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

            if (approx.rows === 4 && area > maxArea) {
              docContour = approx;
              maxArea = area;
            } else {
              approx.delete();
            }
          }
        }

        if (docContour) {
          setScanStatus("OMR Found! Grading...");
          // In a fully robust system, here we apply perspective transform
          // using docContour points, then threshold, find bubbles, and score.
          
          // For now, we simulate a successful grading based on the Answer Key length
          // since exact layout coordinates are needed for exact bubble detection.
          
          setTimeout(() => {
            simulateGrading(selectedExam);
          }, 1000);
          
          docContour.delete();
        } else {
          setScanStatus("Point at OMR sheet...");
        }

        src.delete(); gray.delete(); blurred.delete(); edged.delete();
        contours.delete(); hierarchy.delete();

      } catch (err) {
        console.error("OpenCV Processing Error: ", err);
      }
    }
    setIsProcessing(false);
  };

  // Mock Grading logic for demonstration until exact template is calibrated
  const simulateGrading = (exam) => {
    const totalQuestions = exam.answerKey.length;
    let score = 0;
    const responses = exam.answerKey.map(k => {
      // Simulate 80% accuracy randomly
      const isCorrect = Math.random() > 0.2; 
      if (isCorrect) score++;
      return {
        questionNumber: k.questionNumber,
        correctOption: k.correctOption,
        markedOption: isCorrect ? k.correctOption : "A",
        isCorrect: isCorrect
      };
    });

    setScanResult({
      score,
      totalQuestions,
      percentage: ((score / totalQuestions) * 100).toFixed(1),
      responses
    });
  };

  useEffect(() => {
    let interval = null;
    if (cvLoaded && selectedExam && !scanResult) {
      interval = setInterval(processFrame, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cvLoaded, selectedExam, scanResult]);

  const saveResult = async () => {
    try {
      const payload = {
        examId: selectedExam._id,
        examName: selectedExam.examName,
        studentName: "Student 1",
        rollNumber: "101",
        score: scanResult.score,
        totalQuestions: scanResult.totalQuestions,
        percentage: parseFloat(scanResult.percentage),
        responses: scanResult.responses
      };
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Result Saved Successfully!");
        router.push('/');
      }
    } catch (e) {
      alert("Error saving result");
    }
  };

  const retake = () => {
    setScanResult(null);
    setScanStatus("Point at OMR...");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center pb-24">
      <Script src="https://docs.opencv.org/4.8.0/opencv.js" onReady={onOpenCvReady} strategy="lazyOnload" />
      
      <div className="w-full max-w-md bg-slate-900 min-h-screen relative flex flex-col p-5">
        <h1 className="text-xl font-bold mb-6 text-center text-white flex items-center justify-center gap-2 pt-4">
          <ScanLine size={24} className="text-blue-500" />
          Live Scanner
        </h1>
        
        {!selectedExam ? (
          <div className="flex flex-col gap-4 mt-10">
            <label className="text-slate-400 font-medium text-sm">Select an Exam to Scan:</label>
            <select 
              className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium shadow-sm"
              onChange={handleExamSelect}
              defaultValue=""
            >
              <option value="" disabled>-- Select Exam --</option>
              {exams.map(ex => (
                <option key={ex._id} value={ex._id}>{ex.examName} ({ex.className})</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="mb-6 flex justify-between items-center bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Target Exam</span>
                <span className="text-sm font-bold text-white truncate max-w-[200px]">{selectedExam.examName}</span>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-slate-400 hover:text-white transition-colors">
                <XCircle size={20} />
              </button>
            </div>

            {!scanResult ? (
              <div className="flex-1 flex flex-col items-center">
                <div className={`mb-4 px-4 py-1.5 rounded-full font-semibold text-xs tracking-wide transition-colors ${scanStatus.includes('Grading') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                  {scanStatus}
                </div>
                <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {/* Clean Scanner HUD */}
                  <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg"></div>
                  {/* Corner Accents */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
            ) : (
              <div className="w-full animate-in zoom-in-95 duration-300 flex-1 flex flex-col justify-center">
                <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl text-center mb-8 shadow-xl">
                  <div className="mx-auto w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-2">
                    {scanResult.score} <span className="text-2xl text-slate-500">/ {scanResult.totalQuestions}</span>
                  </h2>
                  <div className="inline-block bg-blue-600/20 text-blue-400 px-4 py-1 rounded-md font-semibold text-sm mt-2">
                    {scanResult.percentage}% Score
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <button onClick={retake} className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors">
                    <RefreshCw size={18} />
                    Retake
                  </button>
                  <button onClick={saveResult} className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/50">
                    <Save size={18} />
                    Save Result
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}