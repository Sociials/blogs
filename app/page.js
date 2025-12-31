// app/page.js
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import Blog from "../model/Blog";
import dbConnect from "../lib/db";
import BlogImage from "./components/BlogImage"; // Ensure this path is correct
import Footer from "./components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_token");

  // Softer Shadow Colors for the blog vibe
  const hoverColors = [
    "hover:shadow-[6px_6px_0px_#A259FF]",
    "hover:shadow-[6px_6px_0px_#FF00A8]",
    "hover:shadow-[6px_6px_0px_#F4D35E]",
    "hover:shadow-[6px_6px_0px_#15F5BA]",
  ];

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-black font-sans">
      {/* --- NAVBAR --- */}
      <nav className="w-full border-b-2 border-black py-5 px-6 sticky top-0 bg-[#F3F2EC]/95 backdrop-blur-md z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* LOGO: Clean & Bold */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 select-none group"
            >
              <span className="unbounded-900 text-xl tracking-tight">
                Sociials
              </span>
              <span className="text-xl font-bold text-gray-400 group-hover:text-black transition-colors">
                /
              </span>
              <span className="text-xl font-bold text-[#A259FF]">Blog</span>
            </Link>

            {/* Search Pill */}
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 text-xs font-bold border-2 border-black bg-white px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://sociials.com"
              className="hidden sm:block text-xs font-bold text-gray-500 hover:text-black transition-colors"
            >
              Back to App ↗
            </a>

            <Link
              href={isAdmin ? "/admin" : "/login"}
              className={`text-xs font-bold px-4 py-2 rounded-full border-2 border-black transition-all ${
                isAdmin
                  ? "bg-[#A259FF] text-white shadow-[2px_2px_0px_#000]"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {isAdmin ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER --- */}
      <header className="max-w-6xl mx-auto pt-20 pb-16 px-6">
        <div className="max-w-3xl">
          <h1 className="unbounded-900 text-5xl sm:text-6xl mb-6 text-black tracking-tight leading-tight">
            Stories, Tips <br className="hidden sm:block" /> &{" "}
            <span className="text-[#A259FF]">Insights.</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-xl leading-relaxed">
            The latest updates and engineering deep dives from the Sociials
            team.
          </p>
        </div>
      </header>

      {/* --- BLOG FEED --- */}
      <main className="max-w-6xl mx-auto px-6 pb-32">
        {blogs.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-gray-300 rounded-[30px] bg-white/50">
            <p className="text-lg text-gray-500 font-bold">
              No stories published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-10">
            {blogs.map((blog, index) => {
              const hoverClass = hoverColors[index % hoverColors.length];

              return (
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
                      hover:-translate-y-1 
                      ${hoverClass}
                      overflow-hidden
                    `}
                  >
                    {/* Cover Image */}
                    {blog.coverImage && (
                      <div className="relative w-full h-52 border-b-2 border-black bg-gray-50">
                        <BlogImage src={blog.coverImage} alt={blog.title} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 sm:p-7 flex flex-col flex-grow">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>

                        {(blog.tags || []).slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-bold uppercase tracking-wider border border-gray-200 text-gray-600 px-2 py-1 rounded bg-gray-50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="unbounded-900 text-xl sm:text-2xl mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4 decoration-black">
                        {blog.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-gray-600 leading-relaxed mb-6 text-sm line-clamp-3">
                        {blog.summary}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-sm flex items-center gap-2 text-gray-900 group-hover:text-[#A259FF] transition-colors">
                          Read Article
                          <span className="text-lg leading-none">→</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
