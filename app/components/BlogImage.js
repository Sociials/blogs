"use client";
import { useState } from "react";

export default function BlogImage({ src, alt }) {
  const [error, setError] = useState(false);

  // 1. HELPER: Check if string is a valid URL
  const isValidUrl = (urlString) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  // 2. HELPER: Convert Google Drive Link to Direct Image Link
  const getDirectImage = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com") && url.includes("/d/")) {
      const id = url.split("/d/")[1].split("/")[0];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  };

  const finalSrc = getDirectImage(src);

  // 3. Fallback UI (Themed for Soft Neo-Brutalism)
  if (!src || !isValidUrl(src) || error) {
    return (
      <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Grid Pattern for texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        ></div>

        <div className="z-10 flex flex-col items-center opacity-40">
          <svg
            className="w-10 h-10 mb-2 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest text-black">
            No Preview
          </span>
        </div>
      </div>
    );
  }

  // 4. Render Standard HTML Image
  // Added 'group-hover:scale-105' which works perfectly with the card designs we built
  return (
    <img
      src={finalSrc}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      onError={() => setError(true)}
    />
  );
}
