import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">
      
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Smart OMR Checker</h1>
        <p className="text-slate-500 text-lg">Teachers ke liye aasan aur tez paper checking system</p>
      </header>

      {/* Main Actions (Buttons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Create Exam Card */}
        <Link href="/create-exam" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col items-center text-center cursor-pointer h-full">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              📝
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Naya Exam Banayein</h2>
            <p className="text-slate-500">Class select karein aur nayi Answer Key system me save karein.</p>
          </div>
        </Link>

        {/* Open Scanner Card */}
        <Link href="/scanner" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:green-border-400 transition-all duration-300 flex flex-col items-center text-center cursor-pointer h-full">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              📷
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Live Scanner Kholein</h2>
            <p className="text-slate-500">Camera open karein aur students ki OMR sheets ko turant check karein.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}