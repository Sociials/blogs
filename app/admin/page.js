"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function AdminPage() {
  const router = useRouter();

  // --- State Management ---
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // New: Image Preview State
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    tags: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("write");
  const [slugEdited, setSlugEdited] = useState(false);

  // Tabs State
  const [activeSection, setActiveSection] = useState("posts"); // 'posts' | 'users'
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // --- 0. Auth Check on Load ---

  // --- API FUNCTIONS (Kept exactly as you provided) ---
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = fetch("/api/admin/users", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (res.ok) {
        setBlogs(Array.isArray(json) ? json : []);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  const updateUserStatus = async (id, status) => {
    if (
      !window.confirm(`Are you sure you want to change this user to ${status}?`)
    )
      return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (res.ok) {
        fetchUsers(); // refresh list
      }
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (activeSection === "users") {
      fetchUsers();
    }
  }, [activeSection]);

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

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("slug", formData.slug);
    submitData.append("summary", formData.summary);
    submitData.append("content", formData.content);
    submitData.append("tags", formData.tags);

    if (imageFile) {
      submitData.append("coverImage", imageFile);
    }
    let res;
    try {
      if (editingId) {
        console.log("IN edit mode");
        res = await fetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          body: submitData,
          credentials: "include",
        });
        console.log("res", res);
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          body: submitData, // FormData
          credentials: "include", // important for cookies
        });
      }

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: editingId ? "✅ Blog Updated!" : "✅ Blog Published!",
          type: "success",
        });
        fetchBlogs();
        if (!editingId) handleReset();
      } else {
        setMessage({
          text: `❌ Error: ${data.error || "Failed"}`,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setMessage({ text: "❌ Connection Failed.", type: "error" });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm("⚠️ Delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${editingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        setMessage({ text: "🗑️ Blog Deleted", type: "success" });
        fetchBlogs();
        handleReset();
      } else {
        const data = await res.json();
        setMessage({ text: `❌ Error: ${data.error}`, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "❌ Delete Failed", type: "error" });
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
    });
    setImagePreview(blog.coverImage);
    setImageFile(null);
    setSlugEdited(true);
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
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Styles
  const inputClass =
    "w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-bold mb-2 text-gray-800";

  return (
    <div className="min-h-screen bg-[#F3F2EC] font-sans text-black">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50 px-6 py-4 flex justify-between items-center h-16">
        <h1 className="unbounded-900 text-xl md:text-2xl font-black">
          Admin <span className="text-[#A259FF]">Panel</span>
        </h1>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-full border border-gray-300">
          <button
            onClick={() => setActiveSection("posts")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              activeSection === "posts"
                ? "bg-black text-white shadow-md"
                : "text-gray-500 hover:text-black"
            }`}
          >
            📝 Posts
          </button>

          <button
            onClick={() => setActiveSection("users")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              activeSection === "users"
                ? "bg-black text-white shadow-md"
                : "text-gray-500 hover:text-black"
            }`}
          >
            👥 Users
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-bold border-2 border-black px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
        >
          Logout
        </button>
      </nav>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        {/* CONDITIONAL RENDERING: POSTS VS USERS */}
        {activeSection === "posts" ? (
          /* ================= POSTS VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SIDEBAR: BLOG LIST */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:h-[calc(100vh-100px)] lg:sticky lg:top-24">
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

              <div className="bg-white rounded-[20px] border-2 border-black flex-1 flex flex-col overflow-hidden shadow-[4px_4px_0px_#000]">
                <div className="p-4 border-b-2 border-gray-100">
                  <input
                    type="text"
                    placeholder="🔍 Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-[#A259FF]"
                  />
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
              className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
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

              {/* EDITOR MAIN */}
              <div className="xl:col-span-2 space-y-6">
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

                <div className="bg-white p-6 rounded-[20px] border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col min-h-[600px]">
                  <div className="flex items-center justify-between mb-4 border-b-2 border-gray-100 pb-2">
                    <label className={labelClass + " mb-0"}>
                      Content (Markdown)
                    </label>
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

              {/* EDITOR SIDEBAR */}
              <div className="space-y-6 xl:sticky xl:top-24 h-fit">
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
                      placeholder="tech, react"
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
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                      <p className="text-xs text-gray-500 font-bold">
                        {imageFile ? imageFile.name : "Click to Upload New"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-3 rounded-lg border-2 border-black overflow-hidden h-40 w-full bg-gray-100 relative group">
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
              <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                <h2 className="unbounded-900 text-2xl font-black">
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
                  <table className="w-full text-sm text-left">
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
