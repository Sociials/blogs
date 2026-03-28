"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import MarkdownToolbar from "../components/MarkdownToolbar";
import StatusBanner from "../components/StatusBanner";
import {
  extractList,
  getErrorMessage,
  parseResponseOrThrow,
  readResponseBody,
} from "../lib/http";

function getEditorValidationMessage(formData) {
  if (!formData.title.trim())
    return "Add a title first so the post has a clear angle.";
  if (!formData.slug.trim())
    return "Add a slug so the post can get its own URL.";
  if (!formData.summary.trim())
    return "Add a short summary so readers know why they should click.";
  if (!formData.content.trim())
    return "Write the main post first. A rough draft is fine.";
  return null;
}

export default function AdminPage() {
  const router = useRouter();

  // --- State Management ---
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Image Preview State
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    tags: "",
    content: "",
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("write");
  const [slugEdited, setSlugEdited] = useState(false);

  // Tabs State
  const [activeSection, setActiveSection] = useState("posts");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Mobile sidebar toggle
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Textarea ref for MarkdownToolbar
  const textareaRef = useRef(null);

  // --- API FUNCTIONS ---
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const res = await fetch("/api/admin/users", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await readResponseBody(res);

      if (res.ok) {
        setUsers(extractList(data));
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setMessage({
          text: getErrorMessage(data, "We could not load users."),
          type: "error",
        });
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setMessage({
        text: getErrorMessage(err, "We could not load users."),
        type: "error",
      });
    } finally {
      setUsersLoading(false);
    }
  }, [router]);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blogs", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await readResponseBody(res);

      if (res.ok) {
        setBlogs(extractList(data));
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setMessage({
          text: getErrorMessage(data, "We could not load posts."),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      setMessage({
        text: getErrorMessage(error, "We could not load posts."),
        type: "error",
      });
    }
  }, [router]);

  const updateUserStatus = async (id, status) => {
    if (
      !window.confirm(`Are you sure you want to change this user to ${status}?`)
    )
      return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      await parseResponseOrThrow(
        res,
        `We could not change this user to ${status}.`,
      );

      setMessage({
        text: `User status changed to ${status}.`,
        type: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
      setMessage({
        text: getErrorMessage(
          err,
          `We could not change this user to ${status}.`,
        ),
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (activeSection === "users") {
      fetchUsers();
    }
  }, [activeSection, fetchUsers]);

  // --- Auto-Slug Logic ---
  useEffect(() => {
    if (!slugEdited && !editingId) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugEdited, editingId]);

  // --- Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const validationError = getEditorValidationMessage(formData);
    if (validationError) {
      setLoading(false);
      setMessage({ text: validationError, type: "error" });
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("slug", formData.slug);
    submitData.append("summary", formData.summary);
    submitData.append("content", formData.content);
    submitData.append("tags", formData.tags);
    submitData.append("status", formData.status);

    if (imageFile) {
      submitData.append("coverImage", imageFile);
    }
    let res;
    try {
      if (editingId) {
        res = await fetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          body: submitData,
          credentials: "include",
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          body: submitData,
          credentials: "include",
        });
      }

      await parseResponseOrThrow(res, "We could not save the blog post.");

      setMessage({
        text: editingId ? "Blog updated." : "Blog published.",
        type: "success",
      });
      fetchBlogs();
      if (!editingId) handleReset();
    } catch (error) {
      console.log(error);
      setMessage({
        text: getErrorMessage(error, "We could not save the blog post."),
        type: "error",
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm("Delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/creator/blogs/${editingId}`, {
        method: "DELETE",
      });

      await parseResponseOrThrow(res, "We could not delete that post.");

      setMessage({ text: "Blog deleted.", type: "success" });
      fetchBlogs();
      handleReset();
    } catch (error) {
      console.log(error);
      setMessage({
        text: getErrorMessage(error, "We could not delete that post."),
        type: "error",
      });
    }
    setLoading(false);
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      summary: blog.summary || "",
      tags: blog.tags || "",
      content: blog.content || "",
      status: blog.status || "published",
    });
    setImagePreview(blog.coverImage);
    setImageFile(null);
    setSlugEdited(true);
    setShowMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMessage({ text: "", type: "" });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      tags: "",
      content: "",
      status: "published",
    });
    setImagePreview(null);
    setImageFile(null);
    setSlugEdited(false);
    setMessage({ text: "", type: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Styles
  const inputClass =
    "w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-bold mb-2 text-gray-800";

  return (
    <div className="min-h-screen bg-[#F3F2EC] font-sans text-black">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50 px-4 md:px-6">
        {/* Top row: Logo + Logout */}
        <div className="flex justify-between items-center h-14">
          <h1 className="unbounded-900 text-lg md:text-2xl font-black">
            Admin <span className="text-[#A259FF]">Panel</span>
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/profile"
              className="text-xs font-bold border-2 border-black bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-gray-100 transition-all"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold border-2 border-black px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Bottom row: Navigation Tabs */}
        <div className="flex gap-2 pb-2 -mt-1">
          <button
            onClick={() => setActiveSection("posts")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              activeSection === "posts"
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:text-black"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
              Posts
            </span>
          </button>
          <button
            onClick={() => setActiveSection("users")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              activeSection === "users"
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:text-black"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="9.5" cy="7" r="3" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Users
            </span>
          </button>
        </div>
      </nav>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-[1600px] mx-auto p-3 md:p-6">
        <StatusBanner
          message={message.text}
          type={message.type}
          className="mb-4"
          onDismiss={() => setMessage({ text: "", type: "" })}
        />

        {/* CONDITIONAL RENDERING: POSTS VS USERS */}
        {activeSection === "posts" ? (
          /* ================= POSTS VIEW ================= */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 items-start">
            {/* MOBILE: Toggle Post List Button */}
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden w-full py-3 rounded-xl border-2 border-black font-bold text-sm bg-white shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2"
            >
              {showMobileSidebar ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Close Post List
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <circle cx="4" cy="6" r="1" fill="currentColor" />
                    <circle cx="4" cy="12" r="1" fill="currentColor" />
                    <circle cx="4" cy="18" r="1" fill="currentColor" />
                  </svg>
                  Browse Posts ({filteredBlogs.length})
                </span>
              )}
            </button>

            {/* LEFT SIDEBAR: BLOG LIST */}
            <div
              className={`w-full lg:col-span-3 flex flex-col gap-4 lg:h-[calc(100vh-120px)] lg:sticky lg:top-24 ${
                showMobileSidebar ? "block" : "hidden lg:flex"
              }`}
            >
              <button
                onClick={handleReset}
                className={`w-full py-3 md:py-4 rounded-[15px] border-2 border-black font-bold text-base md:text-lg shadow-[4px_4px_0px_#000] transition-all active:translate-y-1 hover:shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 ${
                  editingId === null
                    ? "bg-[#A259FF] text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span>+</span> Create New Post
              </button>

              <div className="bg-white rounded-[20px] border-2 border-black flex-1 flex flex-col overflow-hidden shadow-[4px_4px_0px_#000] max-h-[50vh] lg:max-h-none">
                <div className="p-3 md:p-4 border-b-2 border-gray-100">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#A259FF]"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                  {filteredBlogs.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm mt-10">
                      No posts found.
                    </p>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        onClick={() => handleEdit(blog)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:translate-x-1 ${
                          editingId === blog.id
                            ? "bg-[#F3F2EC] border-black shadow-[2px_2px_0px_#A259FF]"
                            : "bg-white border-transparent hover:border-gray-200"
                        }`}
                      >
                        <h4 className="font-bold text-sm line-clamp-2 leading-tight">
                          {blog.title}
                        </h4>
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            blog.status === "draft"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                              : "bg-green-100 text-green-700 border-green-300"
                          }`}
                        >
                          {blog.status || "published"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                          /{blog.slug}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 bg-gray-50 text-center text-xs font-bold border-t-2 border-gray-100 text-gray-400">
                  {filteredBlogs.length} Posts
                </div>
              </div>
            </div>

            {/* RIGHT AREA: EDITOR */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full lg:col-span-9 flex flex-col xl:grid xl:grid-cols-3 xl:items-start gap-4 md:gap-6"
            >
              {/* EDITOR MAIN */}
              <div className="xl:col-span-2 space-y-4 md:space-y-6 order-1">
                {/* Title Card */}
                <div className="bg-white p-4 md:p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000]">
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
                  <p className="text-sm text-gray-500 mb-3">
                    Keep the title clear, clickable, and human. Strong beats
                    overcomplicated.
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="Ex: The thing new creators overthink on day one"
                    value={formData.title}
                    className="w-full text-xl md:text-2xl font-bold border-b-2 border-gray-200 focus:border-[#A259FF] outline-none py-2 transition-colors"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Content Editor Card */}
                <div className="bg-white p-4 md:p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col min-h-[400px] md:min-h-[600px] xl:h-[calc(100vh-8rem)] xl:min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3 border-b-2 border-gray-100 pb-2">
                    <label className={labelClass + " mb-0"}>
                      Content (Markdown)
                    </label>
                    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={() => setActiveTab("write")}
                        className={`px-3 md:px-4 py-1 rounded-md text-xs md:text-sm font-bold transition-all ${
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
                        className={`px-3 md:px-4 py-1 rounded-md text-xs md:text-sm font-bold transition-all ${
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
                    <div className="flex-1 min-h-0 flex flex-col">
                      <MarkdownToolbar
                        textareaRef={textareaRef}
                        content={formData.content}
                        setContent={(val) =>
                          setFormData({ ...formData, content: val })
                        }
                      />
                      <textarea
                        ref={textareaRef}
                        required
                        placeholder="# Start with the one thing you want readers to remember..."
                        value={formData.content}
                        className="flex-1 min-h-0 w-full resize-none overflow-y-auto outline-none font-mono text-sm leading-relaxed p-3 border-2 border-gray-200 border-t-0 rounded-b-xl focus:border-[#A259FF] transition-colors"
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-h-0 w-full overflow-y-auto p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
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

              {/* EDITOR SIDEBAR */}
              <div className="space-y-4 md:space-y-6 xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1 h-fit order-2">
                {/* Publish Card */}
                <div className="bg-white p-4 md:p-6 rounded-[20px] border-2 border-black shadow-[8px_8px_0px_#000]">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500 mb-3">
                    Writer Notes
                  </p>
                  <div className="rounded-xl bg-[#F7F4EA] border border-[#E8DDB8] p-3 mb-4 text-sm text-gray-700 leading-relaxed">
                    First-time writer move: make one point, back it with one
                    real example, then end with one takeaway people can actually
                    use.
                  </div>
                  <h3 className="font-black text-lg mb-4">
                    {editingId ? "Update Post" : "New Post"}
                  </h3>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white font-bold text-base md:text-lg py-3 rounded-xl border-2 border-black hover:bg-[#A259FF] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                  >
                    {loading
                      ? "Processing..."
                      : editingId
                        ? formData.status === "draft"
                          ? "Save Draft Changes"
                          : "Save Published Changes"
                        : formData.status === "draft"
                          ? "Save As Draft"
                          : "Publish Now"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="mt-3 w-full bg-red-50 text-red-600 font-bold text-sm py-2 rounded-xl border-2 border-red-200 hover:bg-red-100 hover:border-red-400 transition-all"
                    >
                      Delete Post
                    </button>
                  )}
                </div>

                {/* Meta Fields Card */}
                <div className="bg-white p-4 md:p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={formData.status}
                      className={inputClass}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
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
                      placeholder="product, creators, culture"
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
                      placeholder="Say what the post is about in 1-2 lines and why someone should care."
                      className={inputClass}
                      onChange={(e) =>
                        setFormData({ ...formData, summary: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Cover Image</label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 hover:border-[#A259FF] transition-colors group">
                      <p className="text-xs text-gray-500 font-bold group-hover:text-[#A259FF]">
                        {imageFile ? (
                          imageFile.name
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            Upload cover
                          </span>
                        )}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-3 rounded-lg border-2 border-black overflow-hidden h-32 md:h-40 w-full bg-gray-100 relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ================= USERS VIEW ================= */
          <div className="max-w-[1200px] mx-auto">
            <div className="bg-white border-2 border-black rounded-[20px] shadow-[8px_8px_0px_#000] overflow-hidden">
              <div className="p-4 md:p-6 border-b-2 border-black bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="unbounded-900 text-xl md:text-2xl font-black">
                  User Management
                </h2>
                <button
                  onClick={fetchUsers}
                  className="text-xs font-bold underline hover:text-[#A259FF]"
                >
                  Refresh List
                </button>
              </div>

              {usersLoading ? (
                <div className="p-12 text-center text-gray-400 italic">
                  Loading users...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Mobile: Card layout */}
                  <div className="sm:hidden divide-y divide-gray-100">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-xs text-gray-500 font-mono">
                              {u.email}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                              u.status === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : u.status === "banned"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                            {u.role}
                          </span>
                          {u.status !== "active" && (
                            <button
                              onClick={() => updateUserStatus(u.id, "active")}
                              className="px-3 py-1 text-xs font-bold border-2 border-black bg-[#15F5BA] rounded hover:shadow-[2px_2px_0px_#000] transition-all"
                            >
                              Approve
                            </button>
                          )}
                          {u.status !== "banned" && (
                            <button
                              onClick={() => updateUserStatus(u.id, "banned")}
                              className="px-3 py-1 text-xs font-bold border-2 border-gray-300 bg-white text-red-500 rounded hover:border-red-500 hover:bg-red-50 transition-all"
                            >
                              Ban
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Table layout */}
                  <table className="w-full text-sm text-left hidden sm:table">
                    <thead className="bg-black text-white uppercase tracking-wider text-xs">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="p-4 font-bold">{u.name}</td>
                          <td className="p-4 text-gray-600 font-mono">
                            {u.email}
                          </td>
                          <td className="p-4">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                u.status === "active"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : u.status === "banned"
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            {u.status !== "active" && (
                              <button
                                onClick={() => updateUserStatus(u.id, "active")}
                                className="px-3 py-1 text-xs font-bold border-2 border-black bg-[#15F5BA] rounded hover:shadow-[2px_2px_0px_#000] transition-all"
                              >
                                Approve
                              </button>
                            )}
                            {u.status !== "banned" && (
                              <button
                                onClick={() => updateUserStatus(u.id, "banned")}
                                className="px-3 py-1 text-xs font-bold border-2 border-gray-300 bg-white text-red-500 rounded hover:border-red-500 hover:bg-red-50 transition-all"
                              >
                                Ban
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="p-10 text-center text-gray-400">
                      No users found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
