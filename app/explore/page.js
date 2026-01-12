import Link from "next/link";
import { cookies } from "next/headers"; // To check auth status
import BlogImage from "../components/BlogImage";
import Footer from "../components/Footer";

// ✅ Force dynamic rendering so search params work
export const dynamic = "force-dynamic";

// Helper: Fetch all blogs from Worker
async function getAllBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
      cache: "no-store", // Always fetch fresh data for search
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Explore fetch error:", error);
    return [];
  }
}

export default async function ExplorePage({ searchParams }) {
  // 1. Fetch All Data
  const allBlogs = await getAllBlogs();

  // 2. Handle Search Query
  // Note: Since 'searchParams' is a promise in newer Next.js versions, we await it.
  const params = await searchParams;
  const query = (params?.q || "").toLowerCase();

  // 3. Filter Blogs (Client-side logic running on Server)
  const filteredBlogs = query
    ? allBlogs.filter((blog) => {
        const titleMatch = blog.title?.toLowerCase().includes(query);
        const summaryMatch = blog.summary?.toLowerCase().includes(query);
        return titleMatch || summaryMatch;
      })
    : allBlogs;

  // 4. Extract Unique Tags
  // D1 stores tags as a string "tech, react", so we split and flatten them.
  const allTags = [
    ...new Set(
      allBlogs.flatMap((blog) => {
        const tagData = blog.tags;
        if (!tagData) return [];
        return Array.isArray(tagData)
          ? tagData
          : tagData.split(",").map((t) => t.trim());
      })
    ),
  ].sort(); // Alphabetical sort

  // 5. Check Auth (Cookie based)
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("token"); // Check if 'token' cookie exists

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col selection:bg-[#A259FF] selection:text-white">
      {/* NAVBAR */}
      <nav className="w-full border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 select-none">
            <a
              href="https://sociials.com"
              className="unbounded-900 text-lg md:text-xl tracking-tight hover:text-[#A259FF] transition-colors"
            >
              Sociials
            </a>
            <span className="text-gray-300 text-xl font-light">/</span>
            <Link
              href="/"
              className="font-bold text-lg md:text-xl text-gray-900"
            >
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold bg-white text-black border-2 border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-all"
            >
              ← Home
            </Link>

            {/* Conditional Dashboard Link */}
            <Link
              href={isLoggedIn ? "/admin" : "/login"}
              className={`text-xs font-bold px-5 py-2 rounded-full border-2 border-transparent transition-all ${
                isLoggedIn
                  ? "bg-[#A259FF] text-white hover:bg-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {isLoggedIn ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-16 w-full">
        {/* HEADER & SEARCH */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h1 className="unbounded-900 text-4xl sm:text-6xl mb-8 tracking-tighter text-black">
            Search <span className="text-[#A259FF]">Archives</span>
          </h1>

          {/* Search Form */}
          <form action="/explore" method="GET" className="relative mb-8 group">
            <input
              type="text"
              name="q"
              placeholder="Type keywords (e.g., React, Tutorial)..."
              defaultValue={query}
              autoFocus={true}
              className="w-full bg-white border-2 border-black rounded-xl p-4 pl-6 text-lg font-bold shadow-sm focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all placeholder:text-gray-400 text-black"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-lg hover:bg-[#A259FF] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Tag Cloud */}
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/topic/${tag}`}
                className="px-4 py-1.5 rounded-lg border-2 border-black text-xs font-bold uppercase tracking-wide bg-white text-black hover:bg-[#A259FF] hover:text-white hover:border-[#A259FF] transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="mb-10 border-b border-black pb-4 flex items-baseline justify-between">
          <h2 className="font-black text-xl md:text-2xl text-black uppercase tracking-tight">
            {query ? (
              <span>
                Results for <span className="text-[#A259FF]">"{query}"</span>
              </span>
            ) : (
              "All Posts"
            )}
          </h2>
          <span className="text-xs font-bold text-gray-500">
            {filteredBlogs.length} Found
          </span>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-[20px]">
            <p className="text-xl text-gray-500 font-bold mb-4">
              Nothing matches that search.
            </p>
            <Link
              href="/explore"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-[#A259FF] transition-colors"
            >
              Clear Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id} // D1 uses 'id', check if your schema is id or _id
                href={`/post/${blog.slug}`}
                className="group block h-full outline-none"
              >
                <article className="flex flex-col h-full bg-white border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0px_#000] hover:shadow-[4px_4px_0px_#A259FF] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-full h-64 border-b-2 border-black relative bg-gray-50">
                    {blog.coverImage && (
                      <BlogImage src={blog.coverImage} alt={blog.title} />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <h2 className="unbounded-900 text-2xl mb-3 leading-tight group-hover:text-[#A259FF] transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
                      {blog.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-black transition-colors">
                      <span className="text-xs font-bold text-black group-hover:translate-x-1 transition-transform">
                        Read Article →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
