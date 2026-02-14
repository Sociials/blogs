"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import MarkdownToolbar from "../../components/MarkdownToolbar";

export default function CreatorDashboard() {
  // --- State ---
  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'editor'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    tags: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("write"); // 'write' | 'preview'

  // Textarea ref for MarkdownToolbar
  const textareaRef = useRef(null);

  // --- Fetch Blogs ---
  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/creator/blogs");
      const data = await res.json();
      if (Array.isArray(data)) setBlogs(data);
      else if (data.data) setBlogs(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // --- Auto Slug ---
  useEffect(() => {
    if (!editingId && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, editingId]);

  // --- Handlers ---
  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      tags: blog.tags || "",
      content: blog.content,
    });
    setImagePreview(blog.coverImage);
    setImageFile(null);
    setView("editor");
    setMsg({ text: "", type: "" });
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({ title: "", slug: "", summary: "", tags: "", content: "" });
    setImagePreview(null);
    setImageFile(null);
    setView("editor");
    setMsg({ text: "", type: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`/api/creator/blogs/${id}`, { method: "DELETE" });
    if (res.ok) fetchBlogs();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("slug", formData.slug);
    payload.append("summary", formData.summary);
    payload.append("tags", formData.tags);
    payload.append("content", formData.content);
    if (imageFile) payload.append("coverImage", imageFile);

    try {
      const url = editingId
        ? `/api/creator/blogs/${editingId}`
        : `/api/creator/blogs`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }

      setMsg({ text: "✅ Success!", type: "success" });
      fetchBlogs();
      setTimeout(() => setView("list"), 1000);
    } catch (err) {
      setMsg({ text: `❌ Error: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#F3F2EC] text-black font-sans p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8">
          <h1 className="unbounded-900 text-2xl md:text-3xl font-black">
            Creator Dashboard
          </h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/profile"
              className="flex-1 sm:flex-initial text-center border-2 border-black px-4 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm"
            >
              👤 Profile
            </Link>
            {view === "list" && (
              <button
                onClick={handleCreateNew}
                className="flex-1 sm:flex-initial bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-[#A259FF] transition-all text-center"
              >
                + Write New
              </button>
            )}
            {view === "editor" && (
              <button
                onClick={() => setView("list")}
                className="flex-1 sm:flex-initial border-2 border-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all text-center"
              >
                ← Back to List
              </button>
            )}
          </div>
        </div>

        {/* --- LIST VIEW --- */}
        {view === "list" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                You haven&apos;t posted anything yet.
              </div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_#000] flex flex-col"
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      className="w-full h-32 object-cover rounded-lg mb-4 border border-black"
                      alt=""
                    />
                  )}
                  <h3 className="font-bold text-lg leading-tight mb-2">
                    {blog.title}
                  </h3>
                  <div className="text-xs text-gray-500 mb-4">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 bg-gray-100 border-2 border-black rounded-lg py-2 font-bold text-xs hover:bg-yellow-100"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 bg-red-50 border-2 border-black rounded-lg text-red-600 font-bold hover:bg-red-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- EDITOR VIEW --- */}
        {view === "editor" && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8"
          >
            {/* Left: Editor */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6 order-1">
              {/* Title */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
                <input
                  type="text"
                  placeholder="Post Title"
                  className="w-full text-xl md:text-2xl font-black border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#A259FF]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Content */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] min-h-[400px] md:min-h-[500px] flex flex-col">
                <div className="flex gap-2 mb-3 border-b border-gray-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 md:px-4 py-1 rounded font-bold text-xs md:text-sm ${activeTab === "write"
                      ? "bg-black text-white"
                      : "text-gray-500"
                      }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 md:px-4 py-1 rounded font-bold text-xs md:text-sm ${activeTab === "preview"
                      ? "bg-black text-white"
                      : "text-gray-500"
                      }`}
                  >
                    Preview
                  </button>
                </div>

                {activeTab === "write" ? (
                  <div className="flex-1 flex flex-col">
                    <MarkdownToolbar
                      textareaRef={textareaRef}
                      content={formData.content}
                      setContent={(val) =>
                        setFormData({ ...formData, content: val })
                      }
                    />
                    <textarea
                      ref={textareaRef}
                      className="flex-1 w-full resize-none outline-none font-mono text-sm min-h-[250px] md:min-h-[350px] p-3 border-2 border-gray-200 border-t-0 rounded-b-xl focus:border-[#A259FF] transition-colors"
                      placeholder="# Write your masterpiece..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                    />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none overflow-y-auto min-h-[250px] md:h-[400px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    {formData.content ? (
                      <ReactMarkdown>{formData.content}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic text-center mt-10">
                        Nothing to preview.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Meta */}
            <div className="space-y-4 md:space-y-6 order-2">
              {/* Publish */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
                <button
                  disabled={loading}
                  className="w-full bg-[#15F5BA] text-black border-2 border-black py-3 rounded-xl font-black hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {loading
                    ? "SAVING..."
                    : editingId
                      ? "UPDATE POST"
                      : "PUBLISH POST"}
                </button>
                {msg.text && (
                  <div
                    className={`mt-4 p-3 rounded-lg text-sm font-bold text-center ${msg.type === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                      }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>

              {/* Meta Fields */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Slug
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-black rounded-lg p-2 font-bold text-sm mt-1"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Summary
                  </label>
                  <textarea
                    rows="3"
                    className="w-full border-2 border-black rounded-lg p-2 text-sm mt-1"
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-black rounded-lg p-2 text-sm mt-1"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Cover Image
                  </label>
                  <div className="relative border-2 border-dashed border-black rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 hover:border-[#A259FF] mt-1 transition-colors group">
                    <span className="text-xs font-bold group-hover:text-[#A259FF]">
                      {imageFile ? imageFile.name : "📷 Click to Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2 border-2 border-black rounded-lg overflow-hidden h-32">
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
