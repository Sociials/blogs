"use client";
import { useState } from "react";
import Image from "next/image";

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

  // 2. If it's empty, gibberish, or previously failed to load -> Show Fallback
  if (!src || !isValidUrl(src) || error) {
    return (
      <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        <svg
          className="w-8 h-8 mb-2 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest">
          No Image
        </span>
      </div>
    );
  }

  // 3. If URL looks valid, try to render it
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setError(true)} // Catches network 404s
    />
  );
}
