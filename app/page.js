import Link from "next/link";
import BlogImage from "./components/BlogImage";
import Footer from "./components/Footer";

// ✅ ISR: Re-generate page every 60 seconds
export const revalidate = 60;

// 1. Fetch Helper (Server Side)
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

export default async function Home() {
  const allBlogs = await getBlogs();

  // Strategy: 1 Big Featured Post + Grid for the rest
  const featuredBlog = allBlogs[0];
  const standardBlogs = allBlogs.slice(1);

  // 2. Extract Unique Tags (Handling D1 String Format)
  const uniqueTags = [
    ...new Set(
      allBlogs.reduce((acc, blog) => {
        // D1 stores tags as "tag1, tag2" string, we need to split it
        const tags =
          typeof blog.tags === "string"
            ? blog.tags.split(",").map((t) => t.trim())
            : blog.tags || [];
        return [...acc, ...tags];
      }, [])
    ),
  ].slice(0, 10);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#A259FF] selection:text-white">
      {/* --- NAVBAR --- */}
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

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search */}
            <Link
              href="/explore"
              className="md:hidden text-gray-500 hover:text-[#A259FF] p-2"
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
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            {/* Desktop Search */}
            <Link
              href="/explore"
              className="hidden md:flex text-sm font-medium text-gray-500 hover:text-[#A259FF] transition-colors items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </Link>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-[10px] md:text-xs font-bold px-3 md:px-5 py-2 rounded-full bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition-all"
            >
              <span className="hidden sm:inline">Writer </span>Login
            </Link>
            <Link
              href="/apply"
              className="text-[10px] md:text-xs font-bold px-3 md:px-5 py-2 rounded-full bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition-all"
            >
              Apply
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        {/* --- 1. HERO --- */}
        <div className="mb-16 border-b border-gray-100 pb-10">
          <h1 className="unbounded-900 text-3xl sm:text-4xl md:text-7xl tracking-tighter text-black mb-4">
            The Feed.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-light max-w-2xl leading-relaxed">
            Engineering, design, and culture. <br />
            Stories from the team building{" "}
            <a
              href="https://sociials.com"
              className="underline decoration-1 underline-offset-4 decoration-gray-300 hover:text-[#A259FF] hover:decoration-[#A259FF] transition-all"
            >
              Sociials
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* === LEFT CONTENT (Posts) === */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            {/* A. FEATURED POST */}
            {featuredBlog ? (
              <Link href={`/post/${featuredBlog.slug}`} className="group block">
                <article className="flex flex-col gap-4">
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 relative shadow-sm group-hover:shadow-md transition-all duration-300">
                    {featuredBlog.coverImage && (
                      <BlogImage
                        src={featuredBlog.coverImage}
                        alt={featuredBlog.title}
                      />
                    )}
                  </div>

                  <div className="space-y-3 mt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[#A259FF] text-xs font-bold uppercase tracking-wider">
                        Latest Story
                      </span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-gray-400 text-xs font-medium uppercase">
                        {new Date(featuredBlog.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>

                    <h2 className="unbounded-900 text-3xl md:text-4xl leading-tight group-hover:text-[#A259FF] transition-colors">
                      {featuredBlog.title}
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed line-clamp-3 max-w-2xl">
                      {featuredBlog.summary}
                    </p>
                  </div>
                </article>
              </Link>
            ) : (
              <div className="p-10 text-center text-gray-400 bg-gray-50 rounded-xl">
                No stories published yet.
              </div>
            )}

            <hr className="border-gray-100" />

            {/* B. RECENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {standardBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/post/${blog.slug}`}
                  className="group block h-full"
                >
                  <article className="flex flex-col h-full gap-4">
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 relative">
                      {blog.coverImage && (
                        <BlogImage src={blog.coverImage} alt={blog.title} />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className="flex gap-2 mb-2">
                        {/* Safe Tag Rendering */}
                        {(typeof blog.tags === "string"
                          ? blog.tags.split(",")
                          : blog.tags || []
                        )
                          .slice(0, 1)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold uppercase text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <h3 className="font-bold text-xl leading-snug mb-2 group-hover:text-[#A259FF] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {blog.summary}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* === RIGHT SIDEBAR === */}
          <aside className="lg:col-span-4 lg:pl-8 space-y-10 border-t lg:border-t-0 lg:border-l border-gray-100 pt-10 lg:pt-0">
            {/* About */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
                About
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                The official engineering and design blog for{" "}
                <strong>Sociials</strong>. We write about building products, the
                creator economy, and web development.
              </p>
              <a
                href="https://sociials.com"
                className="text-sm font-bold text-[#A259FF] hover:underline"
              >
                Visit Main App →
              </a>
            </div>

            {/* Topics */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
                Topics
              </h3>
              <div className="flex flex-col gap-2">
                {uniqueTags.length > 0 ? (
                  uniqueTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/topic/${tag}`}
                      className="group flex justify-between items-center py-2 border-b border-gray-50 hover:bg-gray-50 px-2 rounded transition-colors"
                    >
                      <span className="text-sm text-gray-600 font-medium capitalize group-hover:text-black">
                        {tag}
                      </span>
                      <span className="text-gray-300 text-xs group-hover:text-[#A259FF]">
                        ↗
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No topics yet.</p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Weekly Digest</h3>
              <p className="text-xs text-gray-500 mb-4">
                Get the best stories delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#A259FF] transition-colors"
                />
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#A259FF] transition-colors">
                  Join
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
