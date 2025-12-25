"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function AdminPage() {
  const router = useRouter();

  // --- State Management ---
  const [blogs, setBlogs] = useState([]); // Stores the list of blogs
  const [searchQuery, setSearchQuery] = useState(""); // Search filter
  const [editingId, setEditingId] = useState(null); // ID of blog being edited (null = new mode)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    coverImage: "",
    summary: "",
    tags: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("write");
  const [slugEdited, setSlugEdited] = useState(false);

  // --- 1. Fetch Blogs on Load ---
  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs", { cache: "no-store" });
      const json = await res.json(); // Get the JSON response

      if (res.ok) {
        // Your API returns: { success: true, data: [...] }
        if (json.data && Array.isArray(json.data)) {
          setBlogs(json.data);
        }
        // Fallback for other structures
        else if (Array.isArray(json)) {
          setBlogs(json);
        } else {
          setBlogs([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // --- 2. Auto-Slug Logic ---
  useEffect(() => {
    // Only auto-generate if we are in "Create Mode" and haven't manually edited slug
    if (!slugEdited && !editingId) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugEdited, editingId]);

  // --- 3. Handle Form Submit (Create OR Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Format tags
    const payload = {
      ...formData,
      tags:
        typeof formData.tags === "string"
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((t) => t)
          : formData.tags,
    };

    try {
      const url = editingId ? `/api/blogs?id=${editingId}` : "/api/blogs"; // Adjust query param logic if needed
      const method = editingId ? "PUT" : "POST"; // Switch method based on mode

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: editingId ? "✅ Blog Updated!" : "✅ Blog Published!",
          type: "success",
        });

        // Refresh list
        fetchBlogs();

        // If it was a new post, reset form. If update, stay on it.
        if (!editingId) handleReset();
      } else {
        setMessage({ text: `❌ Error: ${data.error}`, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "❌ Connection Failed.", type: "error" });
    }
    setLoading(false);
  };

  // --- 4. Helper Functions ---

  // Load a blog into the editor
  const handleEdit = (blog) => {
    setEditingId(blog._id); // Assuming your DB uses _id
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      coverImage: blog.coverImage || "",
      summary: blog.summary || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      content: blog.content || "",
    });
    setSlugEdited(true); // Stop auto-slug from overwriting existing slug
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMessage({ text: "", type: "" });
  };

  // Clear form for "New Post"
  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      coverImage: "",
      summary: "",
      tags: "",
      content: "",
    });
    setSlugEdited(false);
    setMessage({ text: "", type: "" });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // --- Filtered List for Search ---
  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Styles
  const inputClass =
    "w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-bold mb-2 text-gray-800";

  return (
    <div className="min-h-screen bg-[#F3F2EC] font-sans text-black">
      {/* Navbar */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50 px-6 py-4 flex justify-between items-center h-16">
        <h1 className="unbounded-900 text-xl md:text-2xl font-black">
          Admin <span className="text-[#A259FF]">Panel</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-xs font-bold border-2 border-black px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
        >
          Logout
        </button>
      </nav>

      {/* --- DASHBOARD LAYOUT (Grid) --- */}
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* === LEFT SIDEBAR: BLOG LIST (Cols 3) === */}
        <div className="lg:col-span-3 flex flex-col gap-4 lg:h-[calc(100vh-100px)] lg:sticky lg:top-24">
          {/* Create New Button */}
          <button
            onClick={handleReset}
            className={`w-full py-4 rounded-[15px] border-2 border-black font-bold text-lg shadow-[4px_4px_0px_#000] transition-all active:translate-y-1 hover:shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 ${
              editingId === null
                ? "bg-[#A259FF] text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span>+</span> Create New Post
          </button>

          {/* Search & List Container */}
          <div className="bg-white rounded-[20px] border-2 border-black flex-1 flex flex-col overflow-hidden shadow-[4px_4px_0px_#000]">
            {/* Search Bar */}
            <div className="p-4 border-b-2 border-gray-100">
              <input
                type="text"
                placeholder="🔍 Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#A259FF]"
              />
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-10">
                  No posts found.
                </p>
              ) : (
                filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => handleEdit(blog)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:translate-x-1 ${
                      editingId === blog._id
                        ? "bg-[#F3F2EC] border-black shadow-[2px_2px_0px_#A259FF]"
                        : "bg-white border-transparent hover:border-gray-200"
                    }`}
                  >
                    <h4 className="font-bold text-sm line-clamp-2 leading-tight">
                      {blog.title}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                      /{blog.slug}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* List Footer */}
            <div className="p-2 bg-gray-50 text-center text-xs font-bold border-t-2 border-gray-100 text-gray-400">
              {filteredBlogs.length} Posts
            </div>
          </div>
        </div>

        {/* === RIGHT AREA: EDITOR (Cols 9) === */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          {/* Notifications */}
          {message.text && (
            <div
              className={`xl:col-span-3 p-4 rounded-xl border-2 border-black font-bold flex justify-between items-center shadow-[4px_4px_0px_#000] ${
                message.type === "error"
                  ? "bg-red-100 text-red-900"
                  : "bg-[#15F5BA] text-black"
              }`}
            >
              <span>{message.text}</span>
              <button
                type="button"
                onClick={() => setMessage({ text: "", type: "" })}
                className="px-2"
              >
                &times;
              </button>
            </div>
          )}

          {/* --- EDITOR COLUMN (Main) --- */}
          <div className="xl:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex justify-between items-center mb-2">
                <label className={labelClass}>
                  {editingId ? "Editing Post" : "New Post Title"}
                </label>
                {editingId && (
                  <span className="text-xs bg-yellow-100 px-2 py-1 rounded border border-yellow-300 font-bold text-yellow-700">
                    EDIT MODE
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Enter title..."
                value={formData.title}
                className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-[#A259FF] outline-none py-2 transition-colors"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Content & Markdown */}
            <div className="bg-white p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between mb-4 border-b-2 border-gray-100 pb-2">
                <label className={labelClass + " mb-0"}>Content</label>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${
                      activeTab === "write"
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${
                      activeTab === "preview"
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <textarea
                  required
                  placeholder="# Hello World..."
                  value={formData.content}
                  className="flex-1 w-full resize-none outline-none font-mono text-sm leading-relaxed min-h-[400px]"
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              ) : (
                <div className="flex-1 w-full overflow-y-auto p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 min-h-[400px]">
                  {formData.content ? (
                    <article className="prose prose-sm lg:prose-base max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl">
                      <ReactMarkdown>{formData.content}</ReactMarkdown>
                    </article>
                  ) : (
                    <p className="text-gray-400 italic text-center mt-10">
                      Nothing to preview.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- META COLUMN (Sidebar) --- */}
          <div className="space-y-6 xl:sticky xl:top-24 h-fit">
            {/* Publish Actions */}
            <div className="bg-white p-6 rounded-[20px] border-2 border-black shadow-[8px_8px_0px_#000]">
              <h3 className="font-black text-lg mb-4">
                {editingId ? "Update Post" : "Publish Post"}
              </h3>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold text-lg py-3 rounded-xl border-2 border-black hover:bg-[#A259FF] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Save Changes"
                  : "Publish Now"}
              </button>
            </div>

            {/* Meta Data Inputs */}
            <div className="bg-white p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  className={inputClass}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugEdited(true);
                  }}
                />
              </div>

              <div>
                <label className={labelClass}>Tags</label>
                <input
                  type="text"
                  placeholder="Comma separated..."
                  value={formData.tags}
                  className={inputClass}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Summary</label>
                <textarea
                  rows="3"
                  required
                  value={formData.summary}
                  className={inputClass}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Cover Image</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  className={inputClass}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                />
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    className="mt-2 rounded border-2 border-black w-full h-32 object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
