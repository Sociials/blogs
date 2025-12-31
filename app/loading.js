export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] flex flex-col items-center justify-center z-50">
      {/* Branding */}
      <h1 className="unbounded-900 text-2xl mb-8 animate-pulse">
        Sociials<span className="text-[#A259FF]">.</span>
      </h1>

      {/* Brutalist Spinner */}
      <div className="relative w-16 h-16">
        {/* Background Box */}
        <div className="absolute inset-0 border-2 border-black rounded-lg bg-gray-200"></div>

        {/* Animated Box */}
        <div className="absolute inset-0 border-2 border-black rounded-lg bg-[#A259FF] animate-spin-slow shadow-[4px_4px_0px_#000]"></div>
      </div>

      <p className="mt-8 font-bold text-xs uppercase tracking-widest text-gray-400">
        Loading Feed...
      </p>

      {/* Custom CSS for slow spin (Tailwind doesn't have a slow spin by default) */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
