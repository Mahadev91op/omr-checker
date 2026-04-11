export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">OMR Scanner</h1>
        <p className="text-xs text-slate-500 font-medium">Hello, Teacher 👋</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
        T
      </div>
    </header>
  );
}