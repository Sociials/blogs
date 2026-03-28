"use client";

import { useEffect, useMemo, useState } from "react";

export default function PostReadingTools({ articleId, title }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  useEffect(() => {
    function updateProgress() {
      const article = document.getElementById(articleId);
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewportHeight = window.innerHeight;
      const distance = window.scrollY - articleTop;
      const total = Math.max(articleHeight - viewportHeight, 1);
      const next = Math.max(0, Math.min(100, Math.round((distance / total) * 100)));
      setProgress(next);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [articleId]);

  const progressLabel = useMemo(() => {
    if (progress >= 100) return "Finished";
    if (progress >= 70) return "Almost there";
    if (progress >= 35) return "In progress";
    return "Just started";
  }, [progress]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title,
        url: window.location.href,
      });
    } catch {}
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-black/5">
        <div
          className="h-full bg-[#15F5BA] transition-[width] duration-150"
          style={{ width: `${Math.max(progress, 0)}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/10 bg-[#F8F8F4] px-3 py-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
          {progress}% read
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-300">
          /
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
          {progressLabel}
        </span>

        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-black/15 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:border-black hover:text-black"
          >
            {copied ? "Link Copied" : "Copy Link"}
          </button>

          {canShare ? (
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full border border-black/15 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:border-black hover:text-black"
            >
              Share
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full border border-black/15 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:border-black hover:text-black"
          >
            Top
          </button>
        </div>
      </div>
    </>
  );
}
