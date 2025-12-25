// app/post/[slug]/page.js
import dbConnect from "../../../lib/db";
import Blog from "../../../model/Blog";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogImage from "../../components/BlogImage"; // 👈 Import the safe image component

async function getBlog(slug) {
  await dbConnect();
  const blog = await Blog.findOne({ slug: slug }).lean();
  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F3F2EC] font-sans text-black pb-16">
      {/* --- NAVBAR --- */}
      <nav className="border-b-2 border-black py-4 px-6 sticky top-0 bg-[#F3F2EC]/90 backdrop-blur-sm z-20">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link
            href="/"
            className="group flex items-center text-sm font-bold text-gray-600 hover:text-black transition-colors"
          >
            <div className="mr-2 bg-white border-2 border-black rounded-full p-1 transition-transform group-hover:-translate-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            Back to All Posts
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* --- HEADER SECTION --- */}
        <header className="mb-10 text-center">
          {/* Date Pill */}
          <div className="inline-block bg-black text-white text-sm font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-6 shadow-[4px_4px_0px_#A259FF]">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Title */}
          <h1 className="unbounded-900 text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-black">
            {blog.title}
          </h1>

          {/* Tags (Optional - Added since we have them now) */}
          {(blog.tags || []).length > 0 && (
            <div className="flex justify-center gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-bold uppercase tracking-wider border border-gray-400 text-gray-600 px-2 py-1 rounded bg-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium border-l-4 border-[#A259FF] pl-4 italic">
            "{blog.summary}"
          </p>
        </header>

        {/* --- COVER IMAGE SECTION (Safe Version) --- */}
        {blog.coverImage && (
          <div className="mb-10 relative h-[300px] md:h-[500px] w-full rounded-[30px] overflow-hidden border-2 border-black shadow-[8px_8px_0px_#000] bg-gray-100">
            {/* 👇 Using BlogImage instead of Next/Image directly */}
            <BlogImage
              src={blog.coverImage}
              alt={`Cover image for ${blog.title}`}
            />
          </div>
        )}

        {/* --- MAIN CONTENT (Markdown) --- */}
        <div
          className="
            bg-white p-8 md:p-12 
            rounded-[30px] border-2 border-black 
            shadow-[8px_8px_0px_#000] 
        "
        >
          <div
            className="
            prose prose-lg prose-gray max-w-none text-black
            prose-headings:font-bold prose-headings:text-black
            prose-a:text-[#A259FF] prose-a:no-underline prose-a:font-bold hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            prose-img:rounded-xl prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0px_#000]
          "
          >
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      {/* --- FOOTER --- */}
      <footer className="text-center pt-8">
        <Link
          href="/"
          className="unbounded-900 text-[#A259FF] hover:text-black transition-colors text-lg"
        >
          Read more on Sociials Blog &rarr;
        </Link>
      </footer>
    </div>
  );
}
