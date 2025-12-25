// app/explore/page.js
import Link from "next/link";
import dbConnect from "../../lib/db";
import Blog from "../../model/Blog";
import BlogImage from "../components/BlogImage"; // 👈 Don't forget to import this

// Force dynamic to handle search params
export const dynamic = "force-dynamic";

export default async function ExplorePage({ searchParams }) {
  await dbConnect();

  // 1. Handle Params
  const params = await searchParams;
  const query = params?.q || "";
  const tagFilter = params?.tag || "";

  // 2. Build Query
  let dbQuery = {};
  if (query) {
    dbQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { summary: { $regex: query, $options: "i" } },
      ],
    };
  } else if (tagFilter) {
    dbQuery = { tags: tagFilter };
  }

  // 3. Fetch Data
  const blogs = await Blog.find(dbQuery).sort({ createdAt: -1 }).lean();
  const allTags = await Blog.distinct("tags");

  return (
    <div className="min-h-screen bg-[#F3F2EC] font-sans text-black">
      {/* --- NAVBAR (Consistent with Home) --- */}
      <nav className="w-full border-b-2 border-black py-5 px-6 sticky top-0 bg-[#F3F2EC]/95 backdrop-blur-md z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none group">
            <span className="unbounded-900 text-xl tracking-tight">
              Sociials
            </span>
            <span className="text-xl font-bold text-gray-400 group-hover:text-black transition-colors">
              /
            </span>
            <span className="text-xl font-bold text-[#A259FF]">Blog</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold border-2 border-black bg-white px-4 py-2 rounded-full hover:shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-all"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* --- SEARCH HEADER --- */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="unbounded-900 text-4xl sm:text-6xl mb-8">
            Explore <span className="text-[#A259FF]">Topics</span>
          </h1>

          {/* Search Form */}
          <form action="/explore" method="GET" className="relative mb-10 group">
            <input
              type="text"
              name="q"
              placeholder="Search for tutorials, updates..."
              defaultValue={query}
              className="w-full p-5 pl-8 rounded-full border-2 border-black shadow-[4px_4px_0px_#000] focus:outline-none focus:shadow-[6px_6px_0px_#A259FF] focus:-translate-y-1 transition-all text-lg font-medium placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-[#A259FF] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/explore"
              className={`px-5 py-2 rounded-full border-2 border-black text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-[3px_3px_0px_#000] ${
                !tagFilter && !query
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              All Posts
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/explore?tag=${tag}`}
                className={`px-5 py-2 rounded-full border-2 border-black text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-[3px_3px_0px_#A259FF] ${
                  tagFilter === tag
                    ? "bg-[#A259FF] text-white shadow-[3px_3px_0px_#000]"
                    : "bg-white text-black"
                }`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* --- RESULTS GRID --- */}
        <div className="mb-8 border-b-2 border-gray-200 pb-4 flex items-baseline justify-between">
          <h2 className="font-bold text-2xl">
            {query
              ? `Search: "${query}"`
              : tagFilter
              ? `Topic: #${tagFilter}`
              : "Latest Articles"}
          </h2>
          <span className="text-gray-500 font-bold text-sm">
            {blogs.length} {blogs.length === 1 ? "Result" : "Results"}
          </span>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-[30px] bg-white/50">
            <p className="text-xl text-gray-500 font-bold mb-2">
              No results found.
            </p>
            <Link
              href="/explore"
              className="text-[#A259FF] font-bold text-lg hover:underline underline-offset-4 decoration-2"
            >
              Clear search filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/post/${blog.slug}`}
                className="group block h-full outline-none"
              >
                <article
                  className={`
                    h-full flex flex-col
                    bg-white 
                    rounded-[24px] border-2 border-black 
                    shadow-[4px_4px_0px_#000] 
                    transition-all duration-300 
                    hover:-translate-y-1 hover:shadow-[6px_6px_0px_#15F5BA]
                    overflow-hidden
                  `}
                >
                  {/* Cover Image (Optional: Keeps it visual) */}
                  {blog.coverImage && (
                    <div className="relative w-full h-48 border-b-2 border-black bg-gray-50">
                      <BlogImage src={blog.coverImage} alt={blog.title} />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(blog.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-600"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <h2 className="unbounded-900 text-xl mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4 decoration-black">
                      {blog.title}
                    </h2>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                      {blog.summary}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-xs font-bold text-gray-400">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-black group-hover:text-[#A259FF] transition-colors">
                        Read →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
