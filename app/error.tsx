"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-black font-sans flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
          Something broke
        </p>
        <h1 className="unbounded-900 text-3xl mt-2">
          This page could not load properly.
        </h1>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          Try loading the page again. If the problem keeps happening, head back
          home and retry the action from there.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-3 rounded-xl border-2 border-black bg-[#15F5BA] font-black hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl border-2 border-black bg-white font-black hover:bg-gray-50 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
