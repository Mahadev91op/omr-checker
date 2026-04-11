"use client";
import { useEffect, useRef, useState } from 'react';

export default function LiveScanner() {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  // Camera start karne ka function
  const startCamera = async () => {
    try {
      // 'facingMode: "environment"' mobile ka back camera open karta hai
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access nahi mila. Kripya permissions check karein.");
    }
  };

  // Jab page load ho, camera start ho jaye
  useEffect(() => {
    startCamera();
    
    // Cleanup function: Jab user page se jaye toh camera band ho jaye
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Live OMR Scanner</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Live Video Feed Container */}
      <div className="relative border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-black">
        
        {/* Video Element */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full max-w-md h-auto"
        />

        {/* Scanning Target Zone (Visual Guide) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[80%] h-[80%] border-2 border-green-500 rounded relative">
            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
            
            {/* Animated Scanning Line */}
            <div className="w-full h-1 bg-green-500 opacity-70 animate-bounce absolute top-0"></div>
          </div>
        </div>

      </div>

      <div className="mt-8 bg-slate-800 p-4 rounded-lg text-center max-w-md">
        <p className="text-sm text-slate-300">
          OMR sheet ko green box ke andar align karein. System automatically bubbles scan kar lega.
        </p>
      </div>
    </div>
  );
}