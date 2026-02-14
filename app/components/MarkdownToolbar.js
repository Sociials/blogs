"use client";

import { useCallback, useEffect, useMemo } from "react";

// --- SVG Icon Components (inline, no dependencies) ---
const Icons = {
  bold: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  heading2: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <text x="1" y="17" fontSize="14" fontWeight="900" fontFamily="system-ui">H2</text>
    </svg>
  ),
  heading3: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <text x="1" y="17" fontSize="14" fontWeight="900" fontFamily="system-ui">H3</text>
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  listBullet: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  listOrdered: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
      <text x="2" y="9" fontSize="8" fontWeight="700" fill="currentColor" stroke="none" fontFamily="system-ui">1</text>
      <text x="2" y="15" fontSize="8" fontWeight="700" fill="currentColor" stroke="none" fontFamily="system-ui">2</text>
      <text x="2" y="21" fontSize="8" fontWeight="700" fill="currentColor" stroke="none" fontFamily="system-ui">3</text>
    </svg>
  ),
  codeBlock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  codeInline: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1.5" strokeDasharray="2 3" />
    </svg>
  ),
  quote: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.085 0-2.127-.522-2.917-1.179zM16.583 17.321C15.553 16.227 15 15 15 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C21.591 11.69 23 13.166 23 15c0 1.933-1.567 3.5-3.5 3.5-1.085 0-2.127-.522-2.917-1.179z" />
    </svg>
  ),
  horizontalRule: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="7" cy="12" r="0.5" fill="currentColor" /><circle cx="12" cy="12" r="0.5" fill="currentColor" /><circle cx="17" cy="12" r="0.5" fill="currentColor" />
    </svg>
  ),
  strikethrough: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  table: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
};

// --- Toolbar Button Definitions ---
const TOOLBAR_ITEMS = [
  { icon: Icons.bold, title: "Bold (Ctrl+B)", prefix: "**", suffix: "**", placeholder: "bold text", id: "bold" },
  { icon: Icons.italic, title: "Italic (Ctrl+I)", prefix: "_", suffix: "_", placeholder: "italic text", id: "italic" },
  { icon: Icons.strikethrough, title: "Strikethrough", prefix: "~~", suffix: "~~", placeholder: "text", id: "strike" },
  { type: "divider" },
  { icon: Icons.heading2, title: "Heading 2", prefix: "## ", suffix: "", placeholder: "Heading", block: true, id: "h2" },
  { icon: Icons.heading3, title: "Heading 3", prefix: "### ", suffix: "", placeholder: "Heading", block: true, id: "h3" },
  { type: "divider" },
  { icon: Icons.link, title: "Link (Ctrl+K)", prefix: "[", suffix: "](https://)", placeholder: "link text", id: "link" },
  { icon: Icons.image, title: "Image", prefix: "![", suffix: "](https://)", placeholder: "alt text", id: "image" },
  { type: "divider" },
  { icon: Icons.listBullet, title: "Bullet List", prefix: "- ", suffix: "", placeholder: "list item", block: true, id: "ul" },
  { icon: Icons.listOrdered, title: "Numbered List", prefix: "1. ", suffix: "", placeholder: "list item", block: true, id: "ol" },
  { type: "divider" },
  { icon: Icons.codeBlock, title: "Code Block", prefix: "```\n", suffix: "\n```", placeholder: "code", block: true, id: "codeblock" },
  { icon: Icons.codeInline, title: "Inline Code", prefix: "`", suffix: "`", placeholder: "code", id: "codeinline" },
  { icon: Icons.quote, title: "Blockquote", prefix: "> ", suffix: "", placeholder: "quote", block: true, id: "quote" },
  { type: "divider" },
  { icon: Icons.table, title: "Table", prefix: "\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| ", suffix: " | data | data |\n", placeholder: "data", block: true, id: "table" },
  { icon: Icons.horizontalRule, title: "Horizontal Rule", prefix: "\n---\n", suffix: "", placeholder: "", block: true, noSelect: true, id: "hr" },
];

export default function MarkdownToolbar({ textareaRef, content, setContent }) {
  // --- Insert Markdown Formatting ---
  const insertFormatting = useCallback(
    (item) => {
      const textarea = textareaRef?.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const before = content.substring(0, start);
      const after = content.substring(end);

      // For block-level items, ensure we start on a new line
      let blockPrefix = "";
      if (item.block && start > 0 && content[start - 1] !== "\n") {
        blockPrefix = "\n";
      }

      const insertText = selectedText || item.placeholder;
      const newText = `${before}${blockPrefix}${item.prefix}${item.noSelect ? "" : insertText}${item.suffix}${after}`;
      setContent(newText);

      // Set cursor position after React re-render
      requestAnimationFrame(() => {
        textarea.focus();
        if (item.noSelect) {
          const pos = start + blockPrefix.length + item.prefix.length;
          textarea.setSelectionRange(pos, pos);
        } else if (selectedText) {
          const newStart = start + blockPrefix.length + item.prefix.length;
          const newEnd = newStart + selectedText.length;
          textarea.setSelectionRange(newStart, newEnd);
        } else {
          const newStart = start + blockPrefix.length + item.prefix.length;
          const newEnd = newStart + item.placeholder.length;
          textarea.setSelectionRange(newStart, newEnd);
        }
      });
    },
    [content, setContent, textareaRef]
  );

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;

      const shortcuts = {
        b: TOOLBAR_ITEMS.find((t) => t.id === "bold"),
        i: TOOLBAR_ITEMS.find((t) => t.id === "italic"),
        k: TOOLBAR_ITEMS.find((t) => t.id === "link"),
      };

      const item = shortcuts[e.key.toLowerCase()];
      if (item) {
        e.preventDefault();
        insertFormatting(item);
      }
    };

    textarea.addEventListener("keydown", handler);
    return () => textarea.removeEventListener("keydown", handler);
  }, [textareaRef, insertFormatting]);

  // --- Word & Character Count ---
  const stats = useMemo(() => {
    const trimmed = (content || "").trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = (content || "").length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readTime };
  }, [content]);

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 bg-gray-50 border-2 border-gray-200 rounded-t-xl">
        {TOOLBAR_ITEMS.map((item, i) =>
          item.type === "divider" ? (
            <div
              key={`div-${i}`}
              className="w-px h-6 bg-gray-200 mx-0.5 hidden sm:block"
            />
          ) : (
            <button
              key={item.id}
              type="button"
              title={item.title}
              onClick={() => insertFormatting(item)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-gray-600 transition-all
                hover:bg-black hover:text-white
                active:scale-90 select-none"
            >
              {item.icon}
            </button>
          )
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-x-2 border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <div className="flex gap-4">
          <span>{stats.words} words</span>
          <span>{stats.chars} chars</span>
        </div>
        <span>~{stats.readTime} min read</span>
      </div>
    </div>
  );
}
