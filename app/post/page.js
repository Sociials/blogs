import Link from "next/link";
import BlogImage from "../components/BlogImage"; // Ensure you have this component
import Footer from "../components/Footer";

// ✅ ISR: Cache this page for 60 seconds, then regenerate.
// This makes the page load instantly from the Edge.
export const revalidate = 60;

// Helper to fetch data from Cloudflare Worker
async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch feed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Connection error:", error);
    return [];
  }
}

export default async function BlogPage() {
  // 1. Fetch from Worker
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-black font-sans flex flex-col selection:bg-[#A259FF] selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="w-full border-b-2 border-black py-4 px-4 md:px-6 sticky top-0 bg-[#F3F2EC]/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 select-none group">
            <a
              href="https://sociials.com"
              className="unbounded-900 text-lg md:text-xl tracking-tight hover:opacity-70 transition-opacity"
            >
              Sociials
            </a>
            <span className="text-xl font-bold text-gray-400">/</span>
            <Link
              href="/"
              className="text-lg md:text-xl font-bold text-[#A259FF] hover:underline decoration-2 underline-offset-4"
            >
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://sociials.com"
              className="text-xs font-bold bg-white border-2 border-black px-4 py-2 rounded-full hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all"
            >
              ← Main Site
            </Link>
            {/* Optional: Add Login link for writers */}
            <Link
              href="/login"
              className="text-xs font-bold bg-black text-white border-2 border-black px-4 py-2 rounded-full hover:bg-[#A259FF] transition-all"
            >
              Writer Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-12 w-full">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="unbounded-900 text-5xl md:text-7xl mb-4 tracking-tighter">
            Sociials <span className="text-[#A259FF]">Blog</span>
          </h1>
          <p className="text-gray-600 font-medium text-lg max-w-xl mx-auto">
            Stories, updates, and engineering deep dives.
          </p>
        </div>

        {/* --- BLOG GRID --- */}
        {blogs.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-400 rounded-[20px] bg-white/50">
            <p className="text-xl text-gray-500 font-bold">
              No blogs posted yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => {
              // HANDLE TAGS: D1 might return "tag1, tag2" string, MongoDB returned Array.
              // This logic handles both safely.
              const tags =
                typeof blog.tags === "string"
                  ? blog.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t)
                  : blog.tags || [];

              return (
                <Link
                  key={blog.id} // D1 uses 'id', not '_id'
                  href={`/post/${blog.slug}`}
                  className="group block h-full"
                >
                  <article className="flex flex-col h-full bg-white border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0px_#000] hover:shadow-[4px_4px_0px_#A259FF] hover:-translate-y-1 transition-all duration-300">
                    {/* Thumbnail / Image Section */}
                    <div className="w-full h-64 border-b-2 border-black relative bg-gray-50">
                      {blog.coverImage && (
                        <BlogImage src={blog.coverImage} alt={blog.title} />
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      {/* Date */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <h2 className="unbounded-900 text-2xl mb-3 leading-tight group-hover:text-[#A259FF] transition-colors">
                        {blog.title}
                      </h2>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">
                        {blog.summary}
                      </p>

                      {/* Bottom Row */}
                      <div className="mt-auto pt-4 border-t border-gray-100 group-hover:border-black transition-colors flex items-center justify-between">
                        <div className="flex gap-2">
                          {tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold uppercase bg-gray-100 border border-gray-200 px-2 py-1 rounded text-gray-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-xs font-bold text-black group-hover:translate-x-1 transition-transform">
                          Read Article
                          <svg
                            className="w-3 h-3 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
