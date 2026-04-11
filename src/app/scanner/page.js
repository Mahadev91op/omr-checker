"use client";
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function LiveScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Background me image draw karne ke liye
  const [error, setError] = useState("");
  const [cvLoaded, setCvLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState("Waiting for OpenCV...");

  // Camera start karne ka function
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access nahi mila. Permissions check karein.");
    }
  };

  // Jab OpenCV load ho jaye
  const onOpenCvReady = () => {
    setCvLoaded(true);
    setScanStatus("Camera Ready. Align OMR Sheet.");
    console.log("OpenCV.js is Ready!");
  };

  // Har 1 second me photo capture karke process karne ka function
  const processFrame = () => {
    if (!cvLoaded || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Video frame ko canvas par draw karna
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        setScanStatus("Scanning...");
        
        // --- OPENCV PROCESSING START ---
        // 1. Canvas se image ko OpenCV Matrix (Mat) me convert karna
        let src = window.cv.imread(canvas);
        let dst = new window.cv.Mat();

        // 2. Image ko Grayscale (Black & White) me convert karna taaki processing fast ho
        window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY);

        // 3. Image ko thoda blur karna taaki noise (kachra) hat jaye
        let ksize = new window.cv.Size(5, 5);
        window.cv.GaussianBlur(dst, dst, ksize, 0, 0, window.cv.BORDER_DEFAULT);

        // 4. Edges (Kinare) detect karna taaki OMR sheet ka box mil sake
        window.cv.Canny(dst, dst, 75, 200);

        // YAHAN PAR ADVANCED LOGIC AAYEGA: (Contours find karna, Bubbles detect karna)
        // Abhi ke liye hum bas check kar rahe hain ki processing chal rahi hai.
        
        // Memory free karna (C++ engine hai, isliye manually delete karna padta hai)
        src.delete();
        dst.delete();
        // --- OPENCV PROCESSING END ---

        setTimeout(() => setScanStatus("Align OMR Sheet."), 500);

      } catch (err) {
        console.error("OpenCV Processing Error: ", err);
      }
    }
  };

  useEffect(() => {
    startCamera();
    
    // Ek interval set karna jo har 1000ms (1 second) me processFrame function chalayega
    let interval = null;
    if (cvLoaded) {
      interval = setInterval(processFrame, 1000);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (interval) clearInterval(interval);
    };
  }, [cvLoaded]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 text-white">
      
      {/* OpenCV Library Load Karna */}
      <Script 
        src="https://docs.opencv.org/4.8.0/opencv.js" 
        onReady={onOpenCvReady}
        strategy="lazyOnload"
      />

      <h1 className="text-3xl font-bold mb-4 text-blue-400">Live OMR Scanner</h1>
      
      {/* Status Indicator */}
      <div className={`mb-4 px-4 py-2 rounded-full font-bold ${scanStatus === 'Scanning...' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
        {scanStatus}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Video Container */}
      <div className="relative border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full max-w-md h-auto"
        />

        {/* Visual Scanner Target (Green Box) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[80%] h-[80%] border-2 border-green-500 rounded relative">
            <div className="w-full h-1 bg-green-500 opacity-70 animate-bounce absolute top-0"></div>
          </div>
        </div>
      </div>

      {/* Hidden Canvas (User ko nahi dikhega, sirf processing ke liye hai) */}
      <canvas ref={canvasRef} className="hidden"></canvas>

    </div>
  );
}