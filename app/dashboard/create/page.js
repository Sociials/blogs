"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import MarkdownToolbar from "../../components/MarkdownToolbar";
import StatusBanner from "../../components/StatusBanner";
import WriterStarterPanel from "../../components/WriterStarterPanel";
import {
  extractList,
  getErrorMessage,
  parseResponseOrThrow,
  readResponseBody,
} from "../../lib/http";

function getEditorValidationMessage(formData) {
  if (!formData.title.trim()) {
    return "Add a title first so the post has a clear angle.";
  }
  if (!formData.slug.trim()) {
    return "Add a slug so the post can get its own URL.";
  }
  if (!formData.summary.trim()) {
    return "Add a short summary so readers know why they should click.";
  }
  if (!formData.content.trim()) {
    return "Write the main post first. A rough draft is fine.";
  }
  return null;
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  summary: "",
  tags: "",
  content: "",
};

export default function CreatorDashboardPage() {
  const router = useRouter();
  const textareaRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("write");
  const [slugEdited, setSlugEdited] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/creator/blogs", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await readResponseBody(res);

      if (res.ok) {
        setBlogs(extractList(data));
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setMsg({
          text: getErrorMessage(
            data,
            "We could not load your posts right now."
          ),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to fetch creator blogs", error);
      setMsg({
        text: getErrorMessage(
          error,
          "We could not load your posts right now."
        ),
        type: "error",
      });
    }
  }, [router]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (!slugEdited && !editingId) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [editingId, formData.title, slugEdited]);

  const openNewPost = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setMsg({ text: "", type: "" });
    setSlugEdited(false);
    setActiveTab("write");
    setView("editor");
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      summary: blog.summary || "",
      tags: blog.tags || "",
      content: blog.content || "",
    });
    setImagePreview(blog.coverImage || null);
    setImageFile(null);
    setMsg({ text: "", type: "" });
    setSlugEdited(true);
    setActiveTab("write");
    setView("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setMsg({ text: "", type: "" });
    setSlugEdited(false);
    setActiveTab("write");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    const validationError = getEditorValidationMessage(formData);
    if (validationError) {
      setLoading(false);
      setMsg({ text: validationError, type: "error" });
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("slug", formData.slug);
    submitData.append("summary", formData.summary);
    submitData.append("content", formData.content);
    submitData.append("tags", formData.tags);

    if (imageFile) {
      submitData.append("coverImage", imageFile);
    }

    try {
      const res = await fetch(
        editingId ? `/api/creator/blogs/${editingId}` : "/api/creator/blogs",
        {
          method: editingId ? "PUT" : "POST",
          body: submitData,
          credentials: "include",
        }
      );

      await parseResponseOrThrow(res, "We could not save your post.");

      setMsg({
        text: editingId ? "Post updated." : "Post published.",
        type: "success",
      });

      await fetchBlogs();
      handleReset();
      setView("list");
    } catch (error) {
      console.error(error);
      setMsg({
        text: getErrorMessage(error, "We could not save your post."),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    const idToDelete = blogId || editingId;
    if (!idToDelete) return;
    if (!window.confirm("Delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/creator/blogs/${idToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      await parseResponseOrThrow(res, "We could not delete that post.");

      setMsg({ text: "Post deleted.", type: "success" });
      await fetchBlogs();
      handleReset();
      setView("list");
    } catch (error) {
      console.error(error);
      setMsg({
        text: getErrorMessage(error, "We could not delete that post."),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-black font-sans">
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="unbounded-900 text-lg md:text-2xl font-black">
              Creator <span className="text-[#A259FF]">Studio</span>
            </h1>
            <span className="hidden md:inline text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              write, edit, publish
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/profile"
              className="text-xs font-bold border-2 border-black bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-gray-100 transition-all"
            >
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold border-2 border-black px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
              Your posts
            </p>
            <h2 className="text-2xl md:text-3xl font-black mt-1">
              {view === "list" ? "Write something worth sharing" : "Shape your draft"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {view === "editor" && (
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setMsg({ text: "", type: "" });
                }}
                className="text-xs md:text-sm font-bold border-2 border-black bg-white px-4 py-2 rounded-full hover:bg-gray-100 transition-all inline-flex items-center gap-1.5"
              >
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
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back to List
              </button>
            )}
            {view === "list" && (
              <button
                type="button"
                onClick={openNewPost}
                className="text-xs md:text-sm font-bold border-2 border-black bg-[#15F5BA] px-4 py-2 rounded-full hover:shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-all"
              >
                New Post
              </button>
            )}
          </div>
        </div>

        {view === "list" && (
          <StatusBanner
            message={msg.text}
            type={msg.type}
            className="mb-6"
            onDismiss={() => setMsg({ text: "", type: "" })}
          />
        )}

        {view === "list" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-300">
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
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="flex-1 bg-gray-100 border-2 border-black rounded-lg py-2 font-bold text-xs hover:bg-yellow-100"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 bg-red-50 border-2 border-black rounded-lg text-red-600 font-bold hover:bg-red-200 inline-flex items-center justify-center"
                      aria-label={`Delete ${blog.title}`}
                    >
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
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="m19 6-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === "editor" && (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col lg:grid lg:grid-cols-3 lg:items-start gap-4 md:gap-8"
          >
            <div className="lg:col-span-2 space-y-4 md:space-y-6 order-1">
              {!editingId && blogs.length === 0 && (
                <WriterStarterPanel
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
                <div className="mb-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
                    Headline
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Make it feel clickable, clear, and human. Good beats clever.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Ex: What shipping our first feature taught us about clarity"
                  className="w-full text-xl md:text-2xl font-black border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#A259FF]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] min-h-[400px] md:min-h-[500px] lg:h-[calc(100vh-8rem)] lg:min-h-0 flex flex-col overflow-hidden">
                <div className="flex gap-2 mb-3 border-b border-gray-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 md:px-4 py-1 rounded font-bold text-xs md:text-sm ${
                      activeTab === "write" ? "bg-black text-white" : "text-gray-500"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 md:px-4 py-1 rounded font-bold text-xs md:text-sm ${
                      activeTab === "preview" ? "bg-black text-white" : "text-gray-500"
                    }`}
                  >
                    Preview
                  </button>
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
                      className="flex-1 min-h-0 w-full resize-none overflow-y-auto outline-none font-mono text-sm p-3 border-2 border-gray-200 border-t-0 rounded-b-xl focus:border-[#A259FF] transition-colors"
                      placeholder="# Start with the one thing you want readers to remember..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                    />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none flex-1 min-h-0 overflow-y-auto p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
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

            <div className="space-y-4 md:space-y-6 order-2 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500 mb-3">
                  Before you publish
                </p>
                <div className="rounded-xl bg-[#F7F4EA] border border-[#E8DDB8] p-3 mb-4 text-sm text-gray-700 leading-relaxed">
                  First-time writer cheat code: explain one idea simply, add one
                  real example, and end with one takeaway people can repeat.
                </div>
                <button
                  disabled={loading}
                  className="w-full bg-[#15F5BA] text-black border-2 border-black py-3 rounded-xl font-black hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {loading ? "SAVING..." : editingId ? "UPDATE POST" : "PUBLISH POST"}
                </button>
                <StatusBanner
                  message={msg.text}
                  type={msg.type}
                  className="mt-4"
                  onDismiss={() => setMsg({ text: "", type: "" })}
                />
              </div>

              <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Slug
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-black rounded-lg p-2 font-bold text-sm mt-1"
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData({ ...formData, slug: e.target.value });
                      setSlugEdited(true);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Summary
                  </label>
                  <textarea
                    rows="3"
                    className="w-full border-2 border-black rounded-lg p-2 text-sm mt-1"
                    placeholder="Say what the post is about in 1-2 lines and why someone should care."
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
                    placeholder="product, creators, growth"
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
                {editingId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingId)}
                    className="w-full border-2 border-red-200 bg-red-50 text-red-700 rounded-lg py-2 font-bold hover:bg-red-100 transition-colors"
                  >
                    Delete Post
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
