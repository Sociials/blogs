"use client";

import { useCallback, useEffect, useMemo } from "react";

// --- Toolbar Button Definitions ---
const TOOLBAR_ITEMS = [
  { label: "B", title: "Bold (Ctrl+B)", prefix: "**", suffix: "**", placeholder: "bold text" },
  { label: "I", title: "Italic (Ctrl+I)", prefix: "_", suffix: "_", placeholder: "italic text", italic: true },
  { label: "H2", title: "Heading 2", prefix: "## ", suffix: "", placeholder: "Heading", block: true },
  { label: "H3", title: "Heading 3", prefix: "### ", suffix: "", placeholder: "Heading", block: true },
  { type: "divider" },
  { label: "🔗", title: "Link (Ctrl+K)", prefix: "[", suffix: "](url)", placeholder: "link text" },
  { label: "🖼️", title: "Image", prefix: "![", suffix: "](url)", placeholder: "alt text" },
  { type: "divider" },
  { label: "•", title: "Bullet List", prefix: "- ", suffix: "", placeholder: "list item", block: true },
  { label: "1.", title: "Numbered List", prefix: "1. ", suffix: "", placeholder: "list item", block: true },
  { label: "<>", title: "Code Block", prefix: "```\n", suffix: "\n```", placeholder: "code", block: true },
  { label: "``", title: "Inline Code", prefix: "`", suffix: "`", placeholder: "code" },
  { label: ">", title: "Blockquote", prefix: "> ", suffix: "", placeholder: "quote", block: true },
  { label: "—", title: "Horizontal Rule", prefix: "\n---\n", suffix: "", placeholder: "", block: true, noSelect: true },
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
          // Keep selection around formatted text
          const newStart = start + blockPrefix.length + item.prefix.length;
          const newEnd = newStart + selectedText.length;
          textarea.setSelectionRange(newStart, newEnd);
        } else {
          // Select the placeholder text so user can type over it
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
        b: TOOLBAR_ITEMS[0], // Bold
        i: TOOLBAR_ITEMS[1], // Italic
        k: TOOLBAR_ITEMS[5], // Link
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
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-2 border-gray-200 rounded-t-xl">
        {TOOLBAR_ITEMS.map((item, i) =>
          item.type === "divider" ? (
            <div
              key={`div-${i}`}
              className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"
            />
          ) : (
            <button
              key={item.label}
              type="button"
              title={item.title}
              onClick={() => insertFormatting(item)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all
                bg-white border border-gray-200 text-gray-700
                hover:bg-black hover:text-white hover:border-black
                active:scale-95 select-none
                ${item.italic ? "italic" : ""}`}
            >
              {item.label}
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
